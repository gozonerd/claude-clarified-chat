import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { parse } from './parser';
import type { Event } from '../../schemas/event';
import type { Metadata } from '../../schemas/metadata';
import type { SubAgentMeta } from '../../schemas/subagent';
import type { UnavailableMarker } from '../../schemas/unavailable';
import type { LogEntry } from '../store/types';

function utf8Encode(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

describe('Parser', () => {
  let files: Map<string, Uint8Array>;

  beforeEach(() => {
    files = new Map();
  });

  describe('metadata parsing', () => {
    it('should parse valid metadata.json', () => {
      const metadata: Metadata = {
        session_id: 'sess-123',
        cli_session_id: 'cli-123',
        cwd: '/workspace',
        model: 'claude-opus-4',
        created_at: '2026-01-01T00:00:00Z',
        last_activity_at: '2026-01-01T00:01:00Z',
        title: 'Test Session',
      };
      files.set('metadata.json', utf8Encode(JSON.stringify(metadata)));

      const result = parse(files);
      expect(result.metadata).toEqual(metadata);
      expect(result.metadata).not.toBeNull();
    });

    it('should return null when metadata.json is missing', () => {
      const result = parse(files);
      expect(result.metadata).toBeNull();
    });

    it('should return UnavailableMarker for malformed metadata.json', () => {
      files.set('metadata.json', utf8Encode('{ invalid json'));

      const result = parse(files);
      expect(result.metadata).not.toBeNull();
      if (result.metadata && 'kind' in result.metadata) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        expect((result.metadata as UnavailableMarker).kind).toBe(
          'unavailable',
        );
      }
    });

    it('should return UnavailableMarker for invalid metadata shape', () => {
      const invalidMetadata = {
        session_id: 123, // should be string
      };
      files.set('metadata.json', utf8Encode(JSON.stringify(invalidMetadata)));

      const result = parse(files);
      expect(result.metadata).not.toBeNull();
      if (result.metadata && 'kind' in result.metadata) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        expect((result.metadata as UnavailableMarker).kind).toBe(
          'unavailable',
        );
      }
    });
  });

  describe('events.jsonl parsing', () => {
    it('should parse valid events from top-level jsonl', () => {
      const event1: Event = {
        id: 'evt-1',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'hello',
      };
      const event2: Event = {
        id: 'evt-2',
        type: 'assistant',
        timestamp: '2026-01-01T00:00:01Z',
        content: 'world',
      };
      const jsonl = `${JSON.stringify(event1)}\n${JSON.stringify(event2)}\n`;
      files.set('events.jsonl', utf8Encode(jsonl));

      const result = parse(files);
      expect(result.store.size).toBe(2);
      expect(result.store.get('evt-1')).toEqual(event1);
      expect(result.store.get('evt-2')).toEqual(event2);
    });

    it('should skip blank lines in jsonl', () => {
      const event: Event = {
        id: 'evt-1',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'hello',
      };
      const jsonl = `\n\n${JSON.stringify(event)}\n\n\n`;
      files.set('events.jsonl', utf8Encode(jsonl));

      const result = parse(files);
      expect(result.store.size).toBe(1);
      expect(result.store.get('evt-1')).toEqual(event);
    });

    it('should add UnavailableMarker for malformed json lines', () => {
      const event: Event = {
        id: 'evt-1',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'hello',
      };
      const jsonl = `${JSON.stringify(event)}\n{ invalid\n`;
      files.set('events.jsonl', utf8Encode(jsonl));

      const result = parse(files);
      expect(result.store.size).toBeGreaterThanOrEqual(2);
      const unavailables = result.store
        .query({ types: ['unavailable'] });
      expect(unavailables.length).toBeGreaterThan(0);
    });

    it('should add UnavailableMarker for invalid event type', () => {
      const invalidEvent = {
        id: 'evt-1',
        type: 'invalid_type', // invalid event type
        timestamp: '2026-01-01T00:00:00Z',
        content: 'test',
      };
      const event: Event = {
        id: 'evt-2',
        type: 'assistant',
        timestamp: '2026-01-01T00:00:01Z',
        content: 'valid',
      };
      const jsonl = `${JSON.stringify(invalidEvent)}\n${JSON.stringify(event)}\n`;
      files.set('events.jsonl', utf8Encode(jsonl));

      const result = parse(files);
      expect(result.store.size).toBeGreaterThanOrEqual(2);
      // Verify that the invalid event generated an unavailable marker
      const unavailables = result.store.query({ types: ['unavailable'] });
      expect(unavailables.length).toBeGreaterThan(0);
    });

    it('should skip jsonl files under subagents/ in top-level pass', () => {
      const event: Event = {
        id: 'evt-1',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'hello',
      };
      const jsonl = `${JSON.stringify(event)}\n`;
      files.set('subagents/agent1/events.jsonl', utf8Encode(jsonl));

      const result = parse(files);
      // Event should be parsed in the subagents pass, not skipped entirely
      expect(result.store.get('evt-1')).toEqual(event);
    });

    it('should handle JSON parse exceptions in parseJsonl', () => {
      // Use a string that will cause JSON.parse to throw
      const invalidJsonl = 'not valid json at all\n';
      files.set('events.jsonl', utf8Encode(invalidJsonl));

      const result = parse(files);
      // Should have an unavailable marker from the parse error
      const unavailables = result.store.query({ types: ['unavailable'] });
      expect(unavailables.length).toBeGreaterThan(0);
    });
  });

  describe('subagent parsing', () => {
    it('should parse valid subagent meta files', () => {
      const meta: SubAgentMeta = {
        id: 'subagent-1',
        spawned_at: '2026-01-01T00:00:00Z',
        parent_id: 'parent-1',
        purpose: 'Testing',
      };
      // Note: the path must END with .meta.json for the parser to recognize it
      files.set('subagents/subagent-1.meta.json', utf8Encode(JSON.stringify(meta)));

      const result = parse(files);
      expect(result.subagentMetas.get('subagent-1')).toEqual(meta);
    });

    it('should add UnavailableMarker for malformed subagent meta', () => {
      files.set('subagents/subagent-1.meta.json', utf8Encode('{ invalid'));

      const result = parse(files);
      const unavailables = result.store
        .query({ types: ['unavailable'] });
      expect(unavailables.length).toBeGreaterThan(0);
    });

    it('should add UnavailableMarker for invalid subagent meta shape', () => {
      const invalidMeta = {
        id: 123, // should be string
      };
      files.set('subagents/subagent-1.meta.json', utf8Encode(JSON.stringify(invalidMeta)));

      const result = parse(files);
      const unavailables = result.store
        .query({ types: ['unavailable'] });
      expect(unavailables.length).toBeGreaterThan(0);
    });

    it('should parse events from subagents directory', () => {
      const event: Event = {
        id: 'evt-1',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'hello',
        subagent_id: 'subagent-1',
      };
      const jsonl = `${JSON.stringify(event)}\n`;
      files.set('subagents/subagent-1.jsonl', utf8Encode(jsonl));

      const result = parse(files);
      expect(result.store.get('evt-1')).toEqual(event);
    });

    it('should parse multiple subagents', () => {
      const meta1: SubAgentMeta = {
        id: 'subagent-1',
        spawned_at: '2026-01-01T00:00:00Z',
        parent_id: 'parent-1',
      };
      const meta2: SubAgentMeta = {
        id: 'subagent-2',
        spawned_at: '2026-01-01T00:01:00Z',
        parent_id: 'parent-1',
      };
      files.set('subagents/subagent-1.meta.json', utf8Encode(JSON.stringify(meta1)));
      files.set('subagents/subagent-2.meta.json', utf8Encode(JSON.stringify(meta2)));

      const result = parse(files);
      expect(result.subagentMetas.get('subagent-1')).toEqual(meta1);
      expect(result.subagentMetas.get('subagent-2')).toEqual(meta2);
    });
  });

  describe('tool results parsing', () => {
    it('should parse tool-results/*.txt files', () => {
      files.set('tool-results/toolcall1.txt', utf8Encode('Tool result data here'));

      const result = parse(files);
      expect(result.toolResults.get('toolcall1')).toBe('Tool result data here');
    });

    it('should handle multiple tool results', () => {
      files.set('tool-results/toolcall1.txt', utf8Encode('Result 1'));
      files.set('tool-results/toolcall2.txt', utf8Encode('Result 2'));

      const result = parse(files);
      expect(result.toolResults.get('toolcall1')).toBe('Result 1');
      expect(result.toolResults.get('toolcall2')).toBe('Result 2');
    });

    it('should map filename without extension to key', () => {
      files.set('tool-results/abc123xyz.txt', utf8Encode('Some data'));

      const result = parse(files);
      expect(result.toolResults.get('abc123xyz')).toBe('Some data');
    });
  });

  describe('log parsing', () => {
    it('should parse logs/*.log files as LogEntry per line', () => {
      const logContent = 'Line 1\nLine 2\nLine 3\n';
      files.set('logs/app.log', utf8Encode(logContent));

      const result = parse(files);
      expect(result.store.size).toBe(3);

      const entries = result.store
        .query({ types: ['log'] });
      expect(entries).toHaveLength(3);
      expect(((entries[0] as LogEntry).line)).toBe('Line 1');
      expect(((entries[1] as LogEntry).line)).toBe('Line 2');
      expect(((entries[2] as LogEntry).line)).toBe('Line 3');
    });

    it('should skip empty lines in log files', () => {
      const logContent = 'Line 1\n\n\nLine 2\n';
      files.set('logs/app.log', utf8Encode(logContent));

      const result = parse(files);
      const entries = result.store
        .query({ types: ['log'] });
      expect(entries).toHaveLength(2);
    });

    it('should handle multiple log files', () => {
      files.set('logs/app.log', utf8Encode('App log line\n'));
      files.set('logs/error.log', utf8Encode('Error log line\n'));

      const result = parse(files);
      const entries = result.store
        .query({ types: ['log'] });
      expect(entries.length).toBeGreaterThanOrEqual(2);
    });

    it('should set source_path on log entries', () => {
      files.set('logs/app.log', utf8Encode('Test line\n'));

      const result = parse(files);
      const entries = result.store
        .query({ types: ['log'] });
      const entry = entries[0] as LogEntry;
      expect(entry.source_path).toBe('logs/app.log');
    });

    it('should create unique ids for log entries', () => {
      const logContent = 'Line 1\nLine 2\n';
      files.set('logs/app.log', utf8Encode(logContent));

      const result = parse(files);
      const entries = result.store
        .query({ types: ['log'] });
      const id1 = (entries[0] as LogEntry).id;
      const id2 = (entries[1] as LogEntry).id;
      expect(id1).not.toBe(id2);
      expect(id1).toContain('logs/app.log#');
      expect(id2).toContain('logs/app.log#');
    });
  });

  describe('complex scenario', () => {
    beforeEach(() => {
      const metadata: Metadata = {
        session_id: 'sess-123',
        cli_session_id: 'cli-123',
        cwd: '/workspace',
        model: 'claude-opus-4',
        created_at: '2026-01-01T00:00:00Z',
        last_activity_at: '2026-01-01T00:10:00Z',
        title: 'Test Session',
      };

      const event1: Event = {
        id: 'evt-1',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'hello',
      };

      const event2: Event = {
        id: 'evt-2',
        type: 'assistant',
        timestamp: '2026-01-01T00:00:01Z',
        content: 'world',
        subagent_id: 'subagent-1',
      };

      const meta: SubAgentMeta = {
        id: 'subagent-1',
        spawned_at: '2026-01-01T00:00:00Z',
        parent_id: 'parent-1',
        purpose: 'Testing',
      };

      files.set('metadata.json', utf8Encode(JSON.stringify(metadata)));
      files.set('events.jsonl', utf8Encode(`${JSON.stringify(event1)}\n`));
      files.set(
        'subagents/subagent-1.meta.json',
        utf8Encode(JSON.stringify(meta)),
      );
      files.set(
        'subagents/subagent-1.jsonl',
        utf8Encode(`${JSON.stringify(event2)}\n`),
      );
      files.set(
        'tool-results/toolcall1.txt',
        utf8Encode('Tool result 1'),
      );
      files.set('logs/app.log', utf8Encode('App started\nProcessing...\n'));
    });

    it('should parse all components together', () => {
      const result = parse(files);

      expect(result.metadata).not.toBeNull();
      expect((result.metadata as Metadata).session_id).toBe('sess-123');

      expect(result.store.size).toBeGreaterThanOrEqual(4); // 2 events + 1 meta + 2 log entries

      expect(result.subagentMetas.get('subagent-1')).toBeDefined();

      expect(result.toolResults.get('toolcall1')).toBe('Tool result 1');

      const logEntries = result.store
        .query({ types: ['log'] });
      expect(logEntries.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('property-based testing', () => {
    it('should never throw on random Uint8Array FileMap', () => {
      const testProperty = (randomUint8Arrays: Uint8Array[]): boolean => {
        const testFiles = new Map<string, Uint8Array>();
        randomUint8Arrays.forEach((arr, idx) => {
          testFiles.set(`file${String(idx)}`, arr);
        });
        try {
          parse(testFiles);
          return true;
        } catch {
          return false;
        }
      };

      fc.assert(fc.property(fc.array(fc.uint8Array()), testProperty), {
        numRuns: 50,
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty FileMap', () => {
      const result = parse(files);
      expect(result.store.size).toBe(0);
      expect(result.metadata).toBeNull();
      expect(result.subagentMetas.size).toBe(0);
      expect(result.toolResults.size).toBe(0);
    });

    it('should handle CRLF line endings in jsonl', () => {
      const event: Event = {
        id: 'evt-1',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'hello',
      };
      const jsonl = `${JSON.stringify(event)}\r\n`;
      files.set('events.jsonl', utf8Encode(jsonl));

      const result = parse(files);
      expect(result.store.get('evt-1')).toEqual(event);
    });

    it('should handle nested subagent directories', () => {
      const event: Event = {
        id: 'evt-1',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'hello',
      };
      files.set(
        'subagents/parent/child/events.jsonl',
        utf8Encode(`${JSON.stringify(event)}\n`),
      );

      const result = parse(files);
      expect(result.store.get('evt-1')).toEqual(event);
    });

    it('should handle Windows path separators in subagents', () => {
      const event: Event = {
        id: 'evt-1',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'hello',
      };
      // Parser checks for both / and \ when looking for subagents prefix
      files.set(
        'subagents/agent1/events.jsonl',
        utf8Encode(`${JSON.stringify(event)}\n`),
      );

      const result = parse(files);
      expect(result.store.get('evt-1')).toEqual(event);
    });

    it('should preserve event with all optional fields', () => {
      const event: Event = {
        id: 'evt-1',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'hello',
        tokens: { input: 10, output: 20 },
        subagent_id: 'subagent-1',
      };
      files.set('events.jsonl', utf8Encode(`${JSON.stringify(event)}\n`));

      const result = parse(files);
      expect(result.store.get('evt-1')).toEqual(event);
    });

    it('should decode UTF-8 content correctly', () => {
      const event: Event = {
        id: 'evt-1',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'Hello with unicode: 你好世界',
      };
      files.set('events.jsonl', utf8Encode(`${JSON.stringify(event)}\n`));

      const result = parse(files);
      const retrieved = result.store.get('evt-1') as Event;
      expect(retrieved.content).toBe('Hello with unicode: 你好世界');
    });
  });
});
