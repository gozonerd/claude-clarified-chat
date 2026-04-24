import { strFromU8 } from 'fflate';
import { EventSchema, type Event } from '../../schemas/event';
import {
  MetadataSchema,
  type Metadata,
} from '../../schemas/metadata';
import {
  SubAgentMetaSchema,
  type SubAgentMeta,
} from '../../schemas/subagent';
import { unavailable, type UnavailableMarker } from '../../schemas/unavailable';
import type { FileMap } from '../ingest/types';
import { EventStore } from '../store/store';
import type { LogEntry } from '../store/types';

export type ParseResult = {
  store: EventStore;
  metadata: Metadata | UnavailableMarker | null;
  subagentMetas: ReadonlyMap<string, SubAgentMeta>;
  toolResults: ReadonlyMap<string, string>;
};

export function parse(files: FileMap): ParseResult {
  const store = new EventStore();
  let metadata: Metadata | UnavailableMarker | null = null;
  const subagentMetas = new Map<string, SubAgentMeta>();
  const toolResults = new Map<string, string>();

  // metadata.json
  for (const [path, data] of files.entries()) {
    if (path === 'metadata.json' || path.endsWith('/metadata.json')) {
      metadata = parseMetadata(data, path);
      break;
    }
  }

  // top-level events jsonl — pick any *.jsonl NOT under subagents/
  for (const [path, data] of files.entries()) {
    if (
      path.endsWith('.jsonl') &&
      !path.includes('subagents/') &&
      !path.includes('subagents\\')
    ) {
      parseJsonl(data, path, store);
    }
  }

  // subagents/*.meta.json + *.jsonl
  for (const [path, data] of files.entries()) {
    if (path.startsWith('subagents/') && path.endsWith('.meta.json')) {
      const text = safeDecode(data);
      try {
        const obj: unknown = JSON.parse(text);
        const parsed = SubAgentMetaSchema.safeParse(obj);
        if (parsed.success) {
          subagentMetas.set(parsed.data.id, parsed.data);
        } else {
          store.add(
            unavailable(
              `invalid subagent meta: ${parsed.error.message}`,
              path,
            ),
          );
        }
      } catch (e) {
        store.add(
          unavailable(
            `malformed subagent meta json: ${(e as Error).message}`,
            path,
          ),
        );
      }
    }
  }

  for (const [path, data] of files.entries()) {
    if (path.startsWith('subagents/') && path.endsWith('.jsonl')) {
      parseJsonl(data, path, store);
    }
  }

  // tool-results/*.txt — associate by filename-id
  for (const [path, data] of files.entries()) {
    if (path.startsWith('tool-results/') && path.endsWith('.txt')) {
      const base = path.slice(
        'tool-results/'.length,
        -'.txt'.length,
      );
      toolResults.set(base, safeDecode(data));
    }
  }

  // logs/*.log — add as LogEntry per line
  for (const [path, data] of files.entries()) {
    if (path.startsWith('logs/') && path.endsWith('.log')) {
      const text = safeDecode(data);
      const lines = text.split(/\r?\n/);
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line === undefined || line === '') continue;
        const entry: LogEntry = {
          kind: 'log',
          id: `${path}#${String(i)}`,
          timestamp: new Date(0).toISOString(),
          line,
          source_path: path,
        };
        store.add(entry);
      }
    }
  }

  return { store, metadata, subagentMetas, toolResults };
}

function parseJsonl(
  data: Uint8Array,
  sourcePath: string,
  store: EventStore,
): void {
  const text = safeDecode(data);
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === undefined || line.trim() === '') continue;
    try {
      const obj: unknown = JSON.parse(line);
      const parsed = EventSchema.safeParse(obj);
      if (parsed.success) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        store.add(parsed.data as Event);
      } else {
        const lineNum = String(i + 1);
        store.add(
          unavailable(
            `invalid event at ${sourcePath}:${lineNum}: ${parsed.error.message}`,
            sourcePath,
          ),
        );
      }
    } catch (e) {
      const lineNum = String(i + 1);
      const errorMsg = (e as Error).message;
      store.add(
        unavailable(
          `malformed json at ${sourcePath}:${lineNum}: ${errorMsg}`,
          sourcePath,
        ),
      );
    }
  }
}

function parseMetadata(
  data: Uint8Array,
  path: string,
): Metadata | UnavailableMarker {
  const text = safeDecode(data);
  try {
    const obj: unknown = JSON.parse(text);
    const parsed = MetadataSchema.safeParse(obj);
    if (parsed.success) return parsed.data;
    return unavailable(`invalid metadata: ${parsed.error.message}`, path);
  } catch (e) {
    return unavailable(
      `malformed metadata json: ${(e as Error).message}`,
      path,
    );
  }
}

function safeDecode(data: Uint8Array): string {
  try {
    return strFromU8(data);
  } catch {
    return new TextDecoder('utf-8', { fatal: false }).decode(data);
  }
}
