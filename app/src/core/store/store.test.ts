import { describe, it, expect } from 'vitest';
import { EventStore } from './store';
import { StoreFrozenError } from './types';
import type { Event } from '../../schemas/event';
import type { LogEntry } from './types';
import { unavailable } from '../../schemas/unavailable';

const createEvent = (overrides?: Partial<Event>): Event => ({
  id: 'evt-1',
  timestamp: '2026-01-01T00:00:00Z',
  type: 'user',
  content: 'hello',
  ...overrides,
});

const createLogEntry = (overrides?: Partial<LogEntry>): LogEntry => ({
  kind: 'log',
  id: 'log-1',
  timestamp: '2026-01-01T00:00:00Z',
  line: 'test log',
  source_path: 'logs/test.log',
  ...overrides,
});

describe('EventStore', () => {
  describe('basic operations', () => {
    it('should start empty', () => {
      const store = new EventStore();
      expect(store.size).toBe(0);
      expect(store.frozen).toBe(false);
    });

    it('should add and retrieve an event', () => {
      const store = new EventStore();
      const event = createEvent();
      store.add(event);
      expect(store.size).toBe(1);
      expect(store.get('evt-1')).toEqual(event);
    });

    it('should return undefined for unknown id', () => {
      const store = new EventStore();
      expect(store.get('unknown')).toBeUndefined();
    });

    it('should add a log entry', () => {
      const store = new EventStore();
      const log = createLogEntry();
      store.add(log);
      expect(store.size).toBe(1);
      expect(store.get('log-1')).toEqual(log);
    });

    it('should add an unavailable marker', () => {
      const store = new EventStore();
      const marker = unavailable('parse error', 'data.json');
      store.add(marker);
      expect(store.size).toBe(1);
      const retrieved = store.get('unavailable:data.json:0');
      expect(retrieved).toBeDefined();
      if (retrieved && 'kind' in retrieved) {
        expect(retrieved.kind).toBe('unavailable');
      } else {
        expect.fail('retrieved should be unavailable marker');
      }
    });
  });

  describe('freeze behavior', () => {
    it('should prevent adds after freeze', () => {
      const store = new EventStore();
      store.freeze();
      const event = createEvent();
      expect(() => {
        store.add(event);
      }).toThrow(StoreFrozenError);
    });

    it('frozen getter should return true after freeze', () => {
      const store = new EventStore();
      expect(!store.frozen).toBe(true);
      store.freeze();
      expect(store.frozen).toBe(true);
    });

    it('StoreFrozenError should have correct name and message', () => {
      const err = new StoreFrozenError();
      expect(err.name === 'StoreFrozenError').toBe(true);
      expect(err.message === 'EventStore is frozen').toBe(true);
    });
  });

  describe('query with no filter', () => {
    it('should return all items sorted by timestamp then seq', () => {
      const store = new EventStore();
      const e1 = createEvent({ id: 'e1', timestamp: '2026-01-01T00:00:00Z' });
      const e2 = createEvent({ id: 'e2', timestamp: '2026-01-02T00:00:00Z' });
      const e3 = createEvent({ id: 'e3', timestamp: '2026-01-01T00:00:00Z' });
      store.add(e1);
      store.add(e2);
      store.add(e3);
      const results = store.query();
      expect(results).toHaveLength(3);
      const r0 = results[0];
      const r1 = results[1];
      const r2 = results[2];
      if (r0 && 'id' in r0) {
        expect(r0.id).toBe('e1'); // first event with 2026-01-01
      }
      if (r1 && 'id' in r1) {
        expect(r1.id).toBe('e3'); // second event with 2026-01-01
      }
      if (r2 && 'id' in r2) {
        expect(r2.id).toBe('e2'); // event with 2026-01-02
      }
    });
  });

  describe('query with types filter', () => {
    it('should filter by single type', () => {
      const store = new EventStore();
      store.add(createEvent({ id: 'e1', type: 'user' }));
      store.add(createEvent({ id: 'e2', type: 'assistant' }));
      store.add(createEvent({ id: 'e3', type: 'user' }));
      const results = store.query({ types: ['user'] });
      expect(results).toHaveLength(2);
      expect(results.every((r) => (r as Event).type === 'user')).toBe(true);
    });

    it('should filter by multiple types', () => {
      const store = new EventStore();
      store.add(createEvent({ id: 'e1', type: 'user' }));
      store.add(createEvent({ id: 'e2', type: 'assistant' }));
      store.add(createEvent({ id: 'e3', type: 'tool_use' }));
      const results = store.query({ types: ['user', 'assistant'] });
      expect(results).toHaveLength(2);
    });

    it('should handle empty types array as no-op', () => {
      const store = new EventStore();
      store.add(createEvent({ id: 'e1' }));
      store.add(createEvent({ id: 'e2' }));
      const results = store.query({ types: [] });
      expect(results).toHaveLength(2);
    });

    it('should include log entries when querying specific types', () => {
      const store = new EventStore();
      store.add(createEvent({ id: 'e1' }));
      store.add(createLogEntry({ id: 'log1' }));
      const results = store.query({ types: ['log'] });
      expect(results).toHaveLength(1);
      const logEntry = results[0] as LogEntry | undefined;
      expect(logEntry?.kind).toBe('log');
    });

    it('should include unavailable markers when querying specific types', () => {
      const store = new EventStore();
      store.add(createEvent({ id: 'e1' }));
      store.add(unavailable('error', 'file.json'));
      const results = store.query({ types: ['unavailable'] });
      expect(results).toHaveLength(1);
      const marker = results[0];
      if (marker && 'kind' in marker) {
        expect(marker.kind).toBe('unavailable');
      } else {
        expect.fail('marker should be unavailable');
      }
    });
  });

  describe('query with subagentId filter', () => {
    it('should filter events by subagent_id', () => {
      const store = new EventStore();
      store.add(createEvent({ id: 'e1', subagent_id: 'sa-1' }));
      store.add(createEvent({ id: 'e2', subagent_id: 'sa-2' }));
      store.add(createEvent({ id: 'e3', subagent_id: 'sa-1' }));
      const results = store.query({ subagentId: 'sa-1' });
      expect(results).toHaveLength(2);
      expect(results.every((r) => (r as Event).subagent_id === 'sa-1')).toBe(
        true,
      );
    });

    it('should exclude events without subagent_id when filtering', () => {
      const store = new EventStore();
      store.add(createEvent({ id: 'e1', subagent_id: 'sa-1' }));
      store.add(createEvent({ id: 'e2' })); // no subagent_id
      const results = store.query({ subagentId: 'sa-1' });
      expect(results).toHaveLength(1);
      expect((results[0] as Event).subagent_id).toBe('sa-1');
    });

    it('should exclude log entries when filtering by subagentId', () => {
      const store = new EventStore();
      store.add(createEvent({ id: 'e1', subagent_id: 'sa-1' }));
      store.add(createLogEntry({ id: 'log1' }));
      const results = store.query({ subagentId: 'sa-1' });
      expect(results).toHaveLength(1);
      const item = results[0];
      if (item && 'kind' in item) {
        expect(item.kind).not.toBe('log');
      } else {
        expect(true).toBe(true); // item is an event, not a log
      }
    });

    it('should exclude unavailable markers when filtering by subagentId', () => {
      const store = new EventStore();
      store.add(createEvent({ id: 'e1', subagent_id: 'sa-1' }));
      store.add(unavailable('error', 'file.json'));
      const results = store.query({ subagentId: 'sa-1' });
      expect(results).toHaveLength(1);
      const item = results[0];
      if (item && 'kind' in item) {
        expect(item.kind).not.toBe('unavailable');
      } else {
        expect(true).toBe(true); // item is an event, not unavailable
      }
    });
  });

  describe('query with keyword filter', () => {
    it('should filter by keyword match in content', () => {
      const store = new EventStore();
      store.add(createEvent({ id: 'e1', content: 'hello world' }));
      store.add(createEvent({ id: 'e2', content: 'goodbye' }));
      store.add(createEvent({ id: 'e3', content: 'hello there' }));
      const results = store.query({ keyword: 'hello' });
      expect(results).toHaveLength(2);
    });

    it('should handle empty keyword as no-op', () => {
      const store = new EventStore();
      store.add(createEvent({ id: 'e1' }));
      store.add(createEvent({ id: 'e2' }));
      const results = store.query({ keyword: '' });
      expect(results).toHaveLength(2);
    });

    it('should search case-insensitively', () => {
      const store = new EventStore();
      store.add(createEvent({ id: 'e1', content: 'Hello World' }));
      store.add(createEvent({ id: 'e2', content: 'goodbye' }));
      const results = store.query({ keyword: 'hello' });
      expect(results).toHaveLength(1);
    });

    it('should find keyword in log entries', () => {
      const store = new EventStore();
      store.add(createEvent({ id: 'e1', content: 'one' }));
      store.add(createLogEntry({ id: 'log1', line: 'debug information' }));
      const results = store.query({ keyword: 'debug' });
      expect(results).toHaveLength(1);
      const logEntry = results[0] as LogEntry | undefined;
      expect(logEntry?.kind).toBe('log');
    });

    it('should find keyword in unavailable markers', () => {
      const store = new EventStore();
      store.add(createEvent({ id: 'e1', content: 'one' }));
      store.add(unavailable('parse error', 'file.json'));
      const results = store.query({ keyword: 'parse' });
      expect(results).toHaveLength(1);
      const marker = results[0];
      if (marker && 'kind' in marker) {
        expect(marker.kind).toBe('unavailable');
      } else {
        expect.fail('marker should be unavailable');
      }
    });
  });

  describe('combined filters', () => {
    it('should apply types and subagentId together', () => {
      const store = new EventStore();
      store.add(createEvent({ id: 'e1', type: 'user', subagent_id: 'sa-1' }));
      store.add(createEvent({ id: 'e2', type: 'user', subagent_id: 'sa-2' }));
      store.add(createEvent({ id: 'e3', type: 'assistant', subagent_id: 'sa-1' }));
      const results = store.query({
        types: ['user'],
        subagentId: 'sa-1',
      });
      expect(results).toHaveLength(1);
      const item = results[0] as Event;
      expect(item.id).toBe('e1');
    });

    it('should apply all three filters together', () => {
      const store = new EventStore();
      store.add(
        createEvent({ id: 'e1', type: 'user', content: 'hello', subagent_id: 'sa-1' }),
      );
      store.add(
        createEvent({ id: 'e2', type: 'user', content: 'goodbye', subagent_id: 'sa-1' }),
      );
      store.add(
        createEvent({ id: 'e3', type: 'assistant', content: 'hello', subagent_id: 'sa-2' }),
      );
      const results = store.query({
        types: ['user'],
        subagentId: 'sa-1',
        keyword: 'hello',
      });
      expect(results).toHaveLength(1);
      const item = results[0] as Event;
      expect(item.id).toBe('e1');
    });
  });

  describe('sorting with timestamp tiebreaking', () => {
    it('should preserve insertion order for items with same timestamp', () => {
      const store = new EventStore();
      const ts = '2026-01-01T00:00:00Z';
      store.add(createEvent({ id: 'e3', timestamp: ts }));
      store.add(createEvent({ id: 'e1', timestamp: ts }));
      store.add(createEvent({ id: 'e2', timestamp: ts }));
      const results = store.query();
      expect(results.map((r) => (r as Event).id)).toEqual(['e3', 'e1', 'e2']);
    });
  });

  describe('mixed item types', () => {
    it('should handle store with events, logs, and unavailable markers', () => {
      const store = new EventStore();
      store.add(createEvent({ id: 'e1', timestamp: '2026-01-01T00:00:00Z' }));
      store.add(createLogEntry({ id: 'log1', timestamp: '2026-01-02T00:00:00Z' }));
      store.add(unavailable('error', 'data.json'));
      expect(store.size).toBe(3);
      const allResults = store.query();
      expect(allResults).toHaveLength(3);
      const types = new Set(allResults.map((r) => ('kind' in r ? r.kind : 'event')));
      expect(types.has('log')).toBe(true);
      expect(types.has('unavailable')).toBe(true);
      expect(types.has('event')).toBe(true);
    });
  });

  describe('size tracking', () => {
    it('should reflect number of added items', () => {
      const store = new EventStore();
      expect(store.size).toBe(0);
      store.add(createEvent({ id: 'e1' }));
      expect(store.size).toBe(1);
      store.add(createEvent({ id: 'e2' }));
      expect(store.size).toBe(2);
      store.add(createLogEntry({ id: 'log1' }));
      expect(store.size).toBe(3);
    });
  });
});
