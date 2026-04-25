import { describe, it, expect } from 'vitest';
import { parse, decode } from './parser';
import type { FileMap } from '../ingest/types';
import {
  loadRealExportFileMap,
  realExportFixturesPresent,
} from '../../__fixtures__/loadRealExport';

const fixturesPresent = realExportFixturesPresent();

const encoder = new TextEncoder();

function createFileMap(entries: Record<string, string>): FileMap {
  const map = new Map<string, Uint8Array>();
  for (const [path, content] of Object.entries(entries)) {
    map.set(path, encoder.encode(content));
  }
  return map;
}

// Empirically-shaped fixtures (camelCase metadata, raw event with message wrapper)
const validMetadata = JSON.stringify({
  sessionId: 'sess-1',
  cliSessionId: 'cli-1',
  cwd: '/home/user',
  model: 'claude-3-sonnet',
  createdAt: 1776882591631,
  lastActivityAt: 1776982591631,
  title: 'test session',
});

const validUserEvent = JSON.stringify({
  type: 'user',
  uuid: 'evt-u-1',
  parentUuid: null,
  isSidechain: false,
  timestamp: '2026-01-01T00:00:00Z',
  sessionId: 'sess-1',
  message: { role: 'user', content: 'hello' },
});

const validSubAgentMeta = JSON.stringify({
  id: 'sa-1',
  spawned_at: '2026-01-01T00:00:00Z',
  parent_id: 'parent-1',
  purpose: 'test',
});

describe('decode', () => {
  it('should decode valid UTF-8 data', () => {
    const data = encoder.encode('hello world');
    expect(decode(data)).toBe('hello world');
  });

  it('should always return a string', () => {
    expect(typeof decode(encoder.encode('test'))).toBe('string');
  });

  it('should decode an empty array as empty string', () => {
    expect(decode(new Uint8Array([]))).toBe('');
  });

  it('handles bytes that are valid UTF-8 (smoke)', () => {
    const data = new Uint8Array([0x41, 0x42, 0x43]);
    expect(decode(data)).toBe('ABC');
  });
});

describe('parse — synthetic empirical-shape fixtures', () => {
  describe('happy path', () => {
    it('parses metadata + user event + subagent + tool-results + logs', async () => {
      const files = createFileMap({
        'metadata.json': validMetadata,
        'events.jsonl': validUserEvent,
        'subagents/a.meta.json': validSubAgentMeta,
        'subagents/a.jsonl': validUserEvent,
        'tool-results/toolX.txt': 'tool output',
        'logs/run.log': 'line1\nline2\nline3',
      });
      const result = await parse(files);
      // 1 main user event normalize → 1 DisplayEvent + 1 subagent user event → 1 DisplayEvent + 3 log lines
      expect(result.store.size).toBe(5);
      expect(result.metadata).not.toBeNull();
      if (result.metadata && 'kind' in result.metadata) {
        expect(result.metadata.kind).not.toBe('unavailable');
      }
      expect(result.subagentMetas.has('sa-1')).toBe(true);
      expect(result.toolResults.get('toolX')).toBe('tool output');
    });
  });

  describe('metadata parsing', () => {
    it('should handle missing metadata.json', async () => {
      const files = createFileMap({ 'events.jsonl': validUserEvent });
      const result = await parse(files);
      expect(result.metadata).toBeNull();
    });

    it('parses metadata.json in nested path', async () => {
      const files = createFileMap({ 'some/dir/metadata.json': validMetadata });
      const result = await parse(files);
      expect(result.metadata).not.toBeNull();
      if (result.metadata && !('kind' in result.metadata)) {
        expect(result.metadata.sessionId).toBe('sess-1');
      }
    });

    it('records malformed metadata JSON as unavailable', async () => {
      const files = createFileMap({ 'metadata.json': 'not json' });
      const result = await parse(files);
      expect(result.metadata && 'kind' in result.metadata && result.metadata.kind === 'unavailable').toBe(true);
    });

    it('records invalid metadata schema as unavailable', async () => {
      const files = createFileMap({
        'metadata.json': JSON.stringify({ wrong: 'shape' }),
      });
      const result = await parse(files);
      expect(result.metadata && 'kind' in result.metadata && result.metadata.kind === 'unavailable').toBe(true);
    });
  });

  describe('events parsing', () => {
    it('parses a valid user event', async () => {
      const files = createFileMap({ 'events.jsonl': validUserEvent });
      const result = await parse(files);
      expect(result.store.size).toBe(1);
    });

    it('skips empty/whitespace lines', async () => {
      const files = createFileMap({
        'events.jsonl': `${validUserEvent}\n\n${validUserEvent}\n  \n`,
      });
      const result = await parse(files);
      expect(result.store.size).toBe(2);
    });

    it('records malformed JSON as unavailable', async () => {
      const files = createFileMap({
        'events.jsonl': `${validUserEvent}\ninvalid json\n`,
      });
      const result = await parse(files);
      const items = result.store.query();
      expect(items.some((it) => 'kind' in it && it.kind === 'unavailable')).toBe(true);
    });

    it('records invalid event schema as unavailable', async () => {
      const invalid = JSON.stringify({ uuid: 'x', noTypeField: true });
      const files = createFileMap({ 'events.jsonl': invalid });
      const result = await parse(files);
      const items = result.store.query();
      expect(items.some((it) => 'kind' in it && it.kind === 'unavailable')).toBe(true);
    });

    it('handles mixed valid + invalid events', async () => {
      const files = createFileMap({
        'events.jsonl': `${validUserEvent}\ninvalid\n${validUserEvent}`,
      });
      const result = await parse(files);
      const items = result.store.query();
      const valid = items.filter((i) => !('kind' in i && i.kind === 'unavailable')).length;
      const bad = items.filter((i) => 'kind' in i && i.kind === 'unavailable').length;
      expect(valid).toBeGreaterThan(0);
      expect(bad).toBeGreaterThan(0);
    });
  });

  describe('subagent metadata parsing', () => {
    it('parses valid subagent metadata', async () => {
      const files = createFileMap({ 'subagents/a.meta.json': validSubAgentMeta });
      const result = await parse(files);
      expect(result.subagentMetas.has('sa-1')).toBe(true);
    });

    it('records malformed subagent meta JSON as unavailable', async () => {
      const files = createFileMap({
        'subagents/a.meta.json': 'not json',
        'events.jsonl': validUserEvent,
      });
      const result = await parse(files);
      const items = result.store.query();
      expect(items.some((i) => 'kind' in i && i.kind === 'unavailable')).toBe(true);
    });

    it('records invalid subagent meta schema as unavailable', async () => {
      const files = createFileMap({
        'subagents/a.meta.json': JSON.stringify({ wrong: 'shape' }),
        'events.jsonl': validUserEvent,
      });
      const result = await parse(files);
      const items = result.store.query();
      expect(items.some((i) => 'kind' in i && i.kind === 'unavailable')).toBe(true);
    });
  });

  describe('subagent events', () => {
    it('parses subagent events', async () => {
      const files = createFileMap({ 'subagents/a.jsonl': validUserEvent });
      const result = await parse(files);
      expect(result.store.size).toBe(1);
    });

    it('handles multiple subagent JSONL files', async () => {
      const files = createFileMap({
        'subagents/a.jsonl': validUserEvent,
        'subagents/b.jsonl': validUserEvent,
      });
      const result = await parse(files);
      expect(result.store.size).toBe(2);
    });
  });

  describe('tool-results', () => {
    it('parses tool-results files', async () => {
      const files = createFileMap({ 'tool-results/toolX.txt': 'result content' });
      const result = await parse(files);
      expect(result.toolResults.get('toolX')).toBe('result content');
    });

    it('extracts nested basename as key', async () => {
      const files = createFileMap({
        'tool-results/deeply/nested/toolY.txt': 'nested result',
      });
      const result = await parse(files);
      expect(result.toolResults.get('deeply/nested/toolY')).toBe('nested result');
    });

    it('handles multiple tool-results', async () => {
      const files = createFileMap({
        'tool-results/tool1.txt': 'r1',
        'tool-results/tool2.txt': 'r2',
      });
      const result = await parse(files);
      expect(result.toolResults.size).toBe(2);
    });
  });

  describe('logs', () => {
    it('parses log files', async () => {
      const files = createFileMap({ 'logs/run.log': 'a\nb\nc' });
      const result = await parse(files);
      const items = result.store.query();
      const logs = items.filter((i) => 'kind' in i && i.kind === 'log');
      expect(logs).toHaveLength(3);
    });

    it('skips empty log lines', async () => {
      const files = createFileMap({ 'logs/run.log': 'a\n\nb\n\n\nc\n' });
      const result = await parse(files);
      const logs = result.store.query().filter((i) => 'kind' in i && i.kind === 'log');
      expect(logs).toHaveLength(3);
    });

    it('handles CRLF line endings', async () => {
      const files = createFileMap({ 'logs/run.log': 'a\r\nb\r\nc\r\n' });
      const result = await parse(files);
      const logs = result.store.query().filter((i) => 'kind' in i && i.kind === 'log');
      expect(logs).toHaveLength(3);
    });

    it('preserves log content', async () => {
      const files = createFileMap({ 'logs/test.log': '[INFO] up\n[ERROR] down' });
      const result = await parse(files);
      const logs = result.store.query().filter((i) => 'kind' in i && i.kind === 'log');
      expect(logs.some((l) => 'line' in l && l.line.includes('up'))).toBe(true);
      expect(logs.some((l) => 'line' in l && l.line.includes('down'))).toBe(true);
    });

    it('handles multiple log files', async () => {
      const files = createFileMap({
        'logs/run.log': 'a\nb',
        'logs/debug.log': 'c\nd\ne',
      });
      const result = await parse(files);
      const logs = result.store.query().filter((i) => 'kind' in i && i.kind === 'log');
      expect(logs).toHaveLength(5);
    });
  });

  describe('edge cases', () => {
    it('handles empty FileMap', async () => {
      const result = await parse(createFileMap({}));
      expect(result.store.size).toBe(0);
      expect(result.metadata).toBeNull();
      expect(result.subagentMetas.size).toBe(0);
      expect(result.toolResults.size).toBe(0);
    });

    it('ignores unrelated file types', async () => {
      const files = createFileMap({ 'random.txt': 'x', 'readme.md': 'y' });
      const result = await parse(files);
      expect(result.store.size).toBe(0);
    });
  });
});

describe.runIf(fixturesPresent)('parse — REAL Claude Desktop export drop-in (F13 prevention)', () => {
  // The load-bearing acceptance: dropping a real export into the parser must
  // produce displayable timeline events, not "unavailable" markers.
  it.each([
    ['export-small-1776882591631', 100],
    ['export-mid-1777064512813', 400],
    ['export-large-1777095820500', 800],
  ] as const)(
    '%s parses with mostly-valid events (>= %i displayable)',
    async (name, minDisplayable) => {
      const files = loadRealExportFileMap(name);
      const result = await parse(files);
      const items = result.store.query();
      const displayable = items.filter((i) => !('kind' in i && i.kind === 'unavailable'));
      const unavailable = items.filter((i) => 'kind' in i && i.kind === 'unavailable');
      expect(displayable.length).toBeGreaterThanOrEqual(minDisplayable);
      // The absolute test of F13 prevention: zero unavailable markers from .jsonl
      // (logs may produce log entries; metadata.json must parse).
      expect(unavailable).toHaveLength(0);
      expect(result.metadata).not.toBeNull();
      if (result.metadata && 'kind' in result.metadata) {
        expect(result.metadata.kind).not.toBe('unavailable');
      }
    },
  );
});
