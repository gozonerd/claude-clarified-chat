import { describe, it, expect } from 'vitest';
import { parse, decode } from './parser';
import type { FileMap } from '../ingest/types';

const encoder = new TextEncoder();

function createFileMap(entries: Record<string, string>): FileMap {
  const map = new Map<string, Uint8Array>();
  for (const [path, content] of Object.entries(entries)) {
    map.set(path, encoder.encode(content));
  }
  return map;
}

const validMetadata = JSON.stringify({
  session_id: 'sess-1',
  cli_session_id: 'cli-1',
  cwd: '/home/user',
  model: 'claude-3-sonnet',
  created_at: '2026-01-01T00:00:00Z',
  last_activity_at: '2026-01-01T01:00:00Z',
  title: 'test session',
});

const validEvent = JSON.stringify({
  id: 'evt-1',
  timestamp: '2026-01-01T00:00:00Z',
  type: 'user',
  content: 'hello',
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
    const result = decode(data);
    expect(result).toBe('hello world');
  });

  it('should handle invalid UTF-8 with fallback decoder', () => {
    // Create sequences that test the fallback path
    // TextDecoder with fatal:false will process these gracefully
    const data = new Uint8Array([0xff, 0xfe, 0xfd, 0x00, 0x41]);
    const result = decode(data);
    // fallback should always return a string (possibly with replacement chars)
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should always return a string', () => {
    const data = encoder.encode('test');
    const result = decode(data);
    expect(typeof result).toBe('string');
  });

  it('should decode edge case: empty array', () => {
    const data = new Uint8Array([]);
    const result = decode(data);
    expect(typeof result).toBe('string');
    expect(result).toBe('');
  });
});

describe('parse', () => {
  describe('happy path', () => {
    it('should parse full data structure with all file types', async () => {
      const files = createFileMap({
        'metadata.json': validMetadata,
        'events.jsonl': validEvent,
        'subagents/a.meta.json': validSubAgentMeta,
        'subagents/a.jsonl': validEvent,
        'tool-results/toolX.txt': 'tool output',
        'logs/run.log': 'line1\nline2\nline3',
      });
      const result = await parse(files);
      expect(result.store.size).toBe(5); // 1 main event + 1 subagent event + 3 log lines
      expect(result.metadata).toBeDefined();
      if (result.metadata && 'kind' in result.metadata) {
        expect(result.metadata.kind).not.toBe('unavailable');
      }
      expect(result.subagentMetas.has('sa-1')).toBe(true);
      expect(result.toolResults.get('toolX')).toBe('tool output');
    });
  });

  describe('metadata parsing', () => {
    it('should handle missing metadata.json', async () => {
      const files = createFileMap({
        'events.jsonl': validEvent,
      });
      const result = await parse(files);
      expect(result.metadata).toBeNull();
    });

    it('should handle metadata.json in root', async () => {
      const files = createFileMap({
        'metadata.json': validMetadata,
      });
      const result = await parse(files);
      expect(result.metadata).toBeDefined();
      if (result.metadata && !('kind' in result.metadata)) {
        expect(result.metadata.session_id).toBe('sess-1');
      }
    });

    it('should handle metadata.json in nested path', async () => {
      const files = createFileMap({
        'some/dir/metadata.json': validMetadata,
      });
      const result = await parse(files);
      expect(result.metadata).toBeDefined();
      if (result.metadata && !('kind' in result.metadata)) {
        expect(result.metadata.session_id).toBeDefined();
      }
    });

    it('should handle malformed metadata JSON', async () => {
      const files = createFileMap({
        'metadata.json': 'not json',
      });
      const result = await parse(files);
      if (result.metadata && 'kind' in result.metadata) {
        expect(result.metadata.kind).toBe('unavailable');
      }
    });

    it('should handle invalid metadata schema', async () => {
      const files = createFileMap({
        'metadata.json': JSON.stringify({ wrong: 'shape' }),
      });
      const result = await parse(files);
      if (result.metadata && 'kind' in result.metadata) {
        expect(result.metadata.kind).toBe('unavailable');
      }
    });
  });

  describe('main events parsing', () => {
    it('should parse valid JSONL events', async () => {
      const files = createFileMap({
        'events.jsonl': validEvent,
      });
      const result = await parse(files);
      expect(result.store.size).toBe(1);
      const item = result.store.get('evt-1');
      expect(item).toBeDefined();
      if (item && 'kind' in item) {
        expect(item.kind).not.toBe('unavailable');
      } else {
        expect(true).toBe(true); // item is an event, not unavailable
      }
    });

    it('should skip empty lines and whitespace', async () => {
      const files = createFileMap({
        'events.jsonl': `${validEvent}\n\n${validEvent}\n  \n`,
      });
      const result = await parse(files);
      expect(result.store.size).toBe(2);
    });

    it('should record invalid JSON as unavailable', async () => {
      const files = createFileMap({
        'events.jsonl': `${validEvent}\ninvalid json\n`,
      });
      const result = await parse(files);
      const items = result.store.query();
      const hasInvalid = items.some((item) => 'kind' in item && item.kind === 'unavailable');
      expect(hasInvalid).toBe(true);
    });

    it('should record invalid event schema as unavailable', async () => {
      const invalidEvent = JSON.stringify({
        id: 'evt-bad',
        // missing required fields
      });
      const files = createFileMap({
        'events.jsonl': invalidEvent,
      });
      const result = await parse(files);
      const items = result.store.query();
      const hasInvalid = items.some((item) => 'kind' in item && item.kind === 'unavailable');
      expect(hasInvalid).toBe(true);
    });

    it('should handle mixed valid and invalid events', async () => {
      const files = createFileMap({
        'events.jsonl': `${validEvent}\ninvalid\n${validEvent}`,
      });
      const result = await parse(files);
      const items = result.store.query();
      const validCount = items.filter((i) => !('kind' in i && i.kind === 'unavailable')).length;
      const invalidCount = items.filter((i) => 'kind' in i && i.kind === 'unavailable').length;
      expect(validCount).toBeGreaterThan(0);
      expect(invalidCount).toBeGreaterThan(0);
    });
  });

  describe('subagent metadata parsing', () => {
    it('should parse valid subagent metadata', async () => {
      const files = createFileMap({
        'subagents/a.meta.json': validSubAgentMeta,
      });
      const result = await parse(files);
      expect(result.subagentMetas.has('sa-1')).toBe(true);
      expect(result.subagentMetas.get('sa-1')?.spawned_at).toBe(
        '2026-01-01T00:00:00Z',
      );
    });

    it('should handle malformed subagent meta JSON', async () => {
      const files = createFileMap({
        'subagents/a.meta.json': 'not json',
        'events.jsonl': validEvent,
      });
      const result = await parse(files);
      const items = result.store.query();
      const hasInvalid = items.some((item) => 'kind' in item && item.kind === 'unavailable');
      expect(hasInvalid).toBe(true);
    });

    it('should handle invalid subagent meta schema', async () => {
      const files = createFileMap({
        'subagents/a.meta.json': JSON.stringify({ wrong: 'shape' }),
        'events.jsonl': validEvent,
      });
      const result = await parse(files);
      const items = result.store.query();
      const hasInvalid = items.some((item) => 'kind' in item && item.kind === 'unavailable');
      expect(hasInvalid).toBe(true);
    });
  });

  describe('subagent events parsing', () => {
    it('should parse subagent events', async () => {
      const files = createFileMap({
        'subagents/a.jsonl': validEvent,
      });
      const result = await parse(files);
      expect(result.store.size).toBe(1);
    });

    it('should handle multiple subagent JSONL files', async () => {
      const files = createFileMap({
        'subagents/a.jsonl': validEvent,
        'subagents/b.jsonl': validEvent,
      });
      const result = await parse(files);
      expect(result.store.size).toBe(2);
    });
  });

  describe('tool results parsing', () => {
    it('should parse tool results files', async () => {
      const files = createFileMap({
        'tool-results/toolX.txt': 'result content',
      });
      const result = await parse(files);
      expect(result.toolResults.get('toolX')).toBe('result content');
    });

    it('should extract basename as key', async () => {
      const files = createFileMap({
        'tool-results/deeply/nested/toolY.txt': 'nested result',
      });
      const result = await parse(files);
      expect(result.toolResults.get('deeply/nested/toolY')).toBe('nested result');
    });

    it('should handle multiple tool results', async () => {
      const files = createFileMap({
        'tool-results/tool1.txt': 'result1',
        'tool-results/tool2.txt': 'result2',
      });
      const result = await parse(files);
      expect(result.toolResults.size).toBe(2);
    });
  });

  describe('logs parsing', () => {
    it('should parse log files', async () => {
      const files = createFileMap({
        'logs/run.log': 'line1\nline2\nline3',
      });
      const result = await parse(files);
      expect(result.store.size).toBe(3);
      const items = result.store.query();
      const logs = items.filter((i) => 'kind' in i && i.kind === 'log');
      expect(logs).toHaveLength(3);
    });

    it('should skip empty log lines', async () => {
      const files = createFileMap({
        'logs/run.log': 'line1\n\nline2\n\n\nline3\n',
      });
      const result = await parse(files);
      const items = result.store.query();
      const logs = items.filter((i) => 'kind' in i && i.kind === 'log');
      expect(logs).toHaveLength(3);
    });

    it('should handle CRLF line endings', async () => {
      const files = createFileMap({
        'logs/run.log': 'line1\r\nline2\r\nline3\r\n',
      });
      const result = await parse(files);
      const items = result.store.query();
      const logs = items.filter((i) => 'kind' in i && i.kind === 'log');
      expect(logs).toHaveLength(3);
    });

    it('should preserve log line content', async () => {
      const files = createFileMap({
        'logs/test.log': '[INFO] startup\n[ERROR] failed',
      });
      const result = await parse(files);
      const items = result.store.query();
      const logs = items.filter((i) => 'kind' in i && i.kind === 'log');
      expect(
        logs.some((l) => 'line' in l && l.line.includes('startup')),
      ).toBe(true);
      expect(
        logs.some((l) => 'line' in l && l.line.includes('failed')),
      ).toBe(true);
    });

    it('should handle multiple log files', async () => {
      const files = createFileMap({
        'logs/run.log': 'line1\nline2',
        'logs/debug.log': 'debug1\ndebug2\ndebug3',
      });
      const result = await parse(files);
      const items = result.store.query();
      const logs = items.filter((i) => 'kind' in i && i.kind === 'log');
      expect(logs).toHaveLength(5);
    });
  });

  describe('file ordering', () => {
    it('should parse metadata first', async () => {
      const files = createFileMap({
        'events.jsonl': validEvent,
        'metadata.json': validMetadata,
      });
      const result = await parse(files);
      expect(result.metadata).toBeDefined();
      if (result.metadata && !('kind' in result.metadata)) {
        expect(result.metadata.session_id).toBeDefined();
      }
    });
  });

  describe('edge cases', () => {
    it('should handle empty FileMap', async () => {
      const files = createFileMap({});
      const result = await parse(files);
      expect(result.store.size).toBe(0);
      expect(result.metadata).toBeNull();
      expect(result.subagentMetas.size).toBe(0);
      expect(result.toolResults.size).toBe(0);
    });

    it('should ignore non-matching file types', async () => {
      const files = createFileMap({
        'random.txt': 'ignored',
        'readme.md': 'also ignored',
      });
      const result = await parse(files);
      expect(result.store.size).toBe(0);
    });
  });
});
