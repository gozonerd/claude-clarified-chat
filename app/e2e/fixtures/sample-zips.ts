import { zipSync, strToU8 } from 'fflate';

export type ZipShape = {
  metadata?: Record<string, unknown>;
  events?: Array<Record<string, unknown>>;
  subagents?: Record<string, { meta: Record<string, unknown>; events: Array<Record<string, unknown>> }>;
  toolResults?: Record<string, string>;
  logs?: Record<string, string>;
};

export function buildZip(shape: ZipShape): Uint8Array {
  const meta = shape.metadata ?? {
    session_id: 's1',
    cli_session_id: 'c1',
    cwd: '/',
    model: 'claude',
    created_at: '2026-01-01T00:00:00Z',
    last_activity_at: '2026-01-02T00:00:00Z',
    title: 't',
  };
  const events = shape.events ?? [
    { id: 'e1', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'hello' },
    { id: 'e2', type: 'assistant', timestamp: '2026-01-01T00:00:01Z', content: 'hi back' },
  ];
  const files: Record<string, Uint8Array> = {
    'metadata.json': strToU8(JSON.stringify(meta)),
    'events.jsonl': strToU8(events.map(e => JSON.stringify(e)).join('\n') + '\n'),
  };
  if (shape.subagents) {
    for (const [name, sa] of Object.entries(shape.subagents)) {
      files[`subagents/${name}.meta.json`] = strToU8(JSON.stringify(sa.meta));
      files[`subagents/${name}.jsonl`] = strToU8(sa.events.map(e => JSON.stringify(e)).join('\n') + '\n');
    }
  }
  if (shape.toolResults) {
    for (const [k, v] of Object.entries(shape.toolResults)) {
      files[`tool-results/${k}.txt`] = strToU8(v);
    }
  }
  if (shape.logs) {
    for (const [k, v] of Object.entries(shape.logs)) {
      files[`logs/${k}.log`] = strToU8(v);
    }
  }
  return zipSync(files);
}


export function buildNonZip(): Uint8Array {
  // Not a zip at all
  return new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04]);
}
