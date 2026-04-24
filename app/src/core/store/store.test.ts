import { describe, it, expect, beforeEach } from 'vitest';
import { EventStore } from './store';
import {
  StoreFrozenError,
  type LogEntry,
} from './types';
import type { Event } from '../../schemas/event';
import { unavailable, type UnavailableMarker } from '../../schemas/unavailable';

describe('EventStore', () => {
  let store: EventStore;

  beforeEach(() => {
    store = new EventStore();
  });

  describe('basic operations', () => {
    it('should initialize with size 0', () => {
      expect(store.size).toBe(0);
    });

    it('should initialize unfrozen', () => {
      expect(store.frozen).toBe(false);
    });

    it('should add an Event', () => {
      const event: Event = {
        id: 'evt-1',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'hello',
      };
      store.add(event);
      expect(store.size).toBe(1);
      expect(store.get('evt-1')).toEqual(event);
    });

    it('should add an UnavailableMarker', () => {
      const marker: UnavailableMarker = unavailable(
        'missing file',
        'path/to/file',
      );
      store.add(marker);
      expect(store.size).toBe(1);
    });

    it('should add a LogEntry', () => {
      const entry: LogEntry = {
        kind: 'log',
        id: 'logs/app.log#0',
        timestamp: '2026-01-01T00:00:00Z',
        line: 'Starting application',
        source_path: 'logs/app.log',
      };
      store.add(entry);
      expect(store.size).toBe(1);
      expect(store.get('logs/app.log#0')).toEqual(entry);
    });

    it('should return undefined for missing id', () => {
      const event: Event = {
        id: 'evt-1',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'hello',
      };
      store.add(event);
      expect(store.get('nonexistent')).toBeUndefined();
    });
  });

  describe('freeze', () => {
    it('should transition from unfrozen to frozen', () => {
      expect(store.frozen).toBe(false);
      store.freeze();
      expect(store.frozen).toBe(true);
    });

    it('should throw StoreFrozenError when adding to frozen store', () => {
      const event: Event = {
        id: 'evt-1',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'hello',
      };
      store.freeze();
      expect(() => {
        store.add(event);
      }).toThrow(StoreFrozenError);
    });

    it('StoreFrozenError should have correct name and message', () => {
      store.freeze();
      const event: Event = {
        id: 'evt-1',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'hello',
      };
      try {
        store.add(event);
        expect.fail('should throw');
      } catch (e) {
        expect(e).toBeInstanceOf(StoreFrozenError);
        expect((e as Error).name).toBe('StoreFrozenError');
        expect((e as Error).message).toBe('EventStore is frozen');
      }
    });
  });

  describe('query by types', () => {
    beforeEach(() => {
      const userEvent: Event = {
        id: 'evt-1',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'hello',
      };
      const assistantEvent: Event = {
        id: 'evt-2',
        type: 'assistant',
        timestamp: '2026-01-01T00:00:01Z',
        content: 'world',
      };
      store.add(userEvent);
      store.add(assistantEvent);
    });

    it('should filter by single type', () => {
      const result = store.query({ types: ['user'] });
      expect(result).toHaveLength(1);
      expect((result[0] as Event).id).toBe('evt-1');
    });

    it('should filter by multiple types', () => {
      const result = store.query({ types: ['user', 'assistant'] });
      expect(result).toHaveLength(2);
    });

    it('should return empty for non-matching type', () => {
      const result = store.query({ types: ['tool_use'] });
      expect(result.length).toBe(0);
    });

    it('should return all items with empty types filter', () => {
      const result = store.query({ types: [] });
      expect(result).toHaveLength(2);
    });
  });

  describe('query by subagentId', () => {
    beforeEach(() => {
      const event1: Event = {
        id: 'evt-1',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'hello',
        subagent_id: 'subagent-1',
      };
      const event2: Event = {
        id: 'evt-2',
        type: 'assistant',
        timestamp: '2026-01-01T00:00:01Z',
        content: 'world',
        subagent_id: 'subagent-2',
      };
      const event3: Event = {
        id: 'evt-3',
        type: 'user',
        timestamp: '2026-01-01T00:00:02Z',
        content: 'hi again',
      };
      store.add(event1);
      store.add(event2);
      store.add(event3);
    });

    it('should filter by subagentId', () => {
      const result = store.query({ subagentId: 'subagent-1' });
      expect(result).toHaveLength(1);
      expect((result[0] as Event).subagent_id).toBe('subagent-1');
    });

    it('should return empty for non-matching subagentId', () => {
      const result = store.query({ subagentId: 'nonexistent' });
      expect(result).toHaveLength(0);
    });

    it('should exclude items without subagent_id', () => {
      const result = store.query({ subagentId: 'subagent-1' });
      expect(result).toHaveLength(1);
    });
  });

  describe('query by keyword', () => {
    beforeEach(() => {
      const event1: Event = {
        id: 'evt-1',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'hello world',
      };
      const event2: Event = {
        id: 'evt-2',
        type: 'assistant',
        timestamp: '2026-01-01T00:00:01Z',
        content: 'goodbye',
      };
      store.add(event1);
      store.add(event2);
    });

    it('should filter by keyword (case-insensitive)', () => {
      const result = store.query({ keyword: 'hello' });
      expect(result).toHaveLength(1);
      expect((result[0] as Event).id).toBe('evt-1');
    });

    it('should filter by keyword in uppercase', () => {
      const result = store.query({ keyword: 'HELLO' });
      expect(result).toHaveLength(1);
    });

    it('should return empty for non-matching keyword', () => {
      const result = store.query({ keyword: 'nonexistent' });
      expect(result).toHaveLength(0);
    });

    it('should return all for empty keyword', () => {
      const result = store.query({ keyword: '' });
      expect(result).toHaveLength(2);
    });
  });

  describe('query sorting', () => {
    it('should sort by timestamp ascending', () => {
      const event1: Event = {
        id: 'evt-1',
        type: 'user',
        timestamp: '2026-01-01T00:00:02Z',
        content: 'late',
      };
      const event2: Event = {
        id: 'evt-2',
        type: 'assistant',
        timestamp: '2026-01-01T00:00:01Z',
        content: 'early',
      };
      const event3: Event = {
        id: 'evt-3',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'earliest',
      };
      store.add(event1);
      store.add(event2);
      store.add(event3);

      const result = store.query();
      expect((result[0] as Event).id).toBe('evt-3');
      expect((result[1] as Event).id).toBe('evt-2');
      expect((result[2] as Event).id).toBe('evt-1');
    });

    it('should use insertion order for tiebreaker', () => {
      const event1: Event = {
        id: 'evt-1',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'first',
      };
      const event2: Event = {
        id: 'evt-2',
        type: 'assistant',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'second',
      };
      const event3: Event = {
        id: 'evt-3',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'third',
      };
      store.add(event1);
      store.add(event2);
      store.add(event3);

      const result = store.query();
      expect((result[0] as Event).id).toBe('evt-1');
      expect((result[1] as Event).id).toBe('evt-2');
      expect((result[2] as Event).id).toBe('evt-3');
    });
  });

  describe('mixed item types', () => {
    it('should handle Event, UnavailableMarker, and LogEntry together', () => {
      const event: Event = {
        id: 'evt-1',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'hello',
      };
      const marker: UnavailableMarker = unavailable(
        'missing file',
        'path/to/file',
      );
      const logEntry: LogEntry = {
        kind: 'log',
        id: 'logs/app.log#0',
        timestamp: '2026-01-01T00:00:01Z',
        line: 'app started',
        source_path: 'logs/app.log',
      };

      store.add(event);
      store.add(marker);
      store.add(logEntry);

      expect(store.size).toBe(3);
      expect(store.get('evt-1')).toEqual(event);
      expect(store.get('logs/app.log#0')).toEqual(logEntry);
    });

    it('should query mixed types', () => {
      const event: Event = {
        id: 'evt-1',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'hello',
      };
      const marker: UnavailableMarker = unavailable(
        'missing file',
        'path/to/file',
      );
      const logEntry: LogEntry = {
        kind: 'log',
        id: 'logs/app.log#0',
        timestamp: '2026-01-01T00:00:01Z',
        line: 'app started',
        source_path: 'logs/app.log',
      };

      store.add(event);
      store.add(marker);
      store.add(logEntry);

      const result = store.query();
      expect(result).toHaveLength(3);
      // UnavailableMarker has empty timestamp, so it sorts first
      expect((result[0] as UnavailableMarker).kind).toBe('unavailable');
      expect((result[1] as Event).id).toBe('evt-1');
      expect((result[2] as LogEntry).id).toBe('logs/app.log#0');
    });

    it('should filter by event type excluding non-events', () => {
      const event: Event = {
        id: 'evt-1',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'hello',
      };
      const marker: UnavailableMarker = unavailable(
        'missing file',
        'path/to/file',
      );
      const logEntry: LogEntry = {
        kind: 'log',
        id: 'logs/app.log#0',
        timestamp: '2026-01-01T00:00:01Z',
        line: 'app started',
        source_path: 'logs/app.log',
      };

      store.add(event);
      store.add(marker);
      store.add(logEntry);

      const result = store.query({ types: ['user'] });
      expect(result).toHaveLength(1);
      expect((result[0] as Event).id).toBe('evt-1');
    });
  });

  describe('empty filter path', () => {
    it('should return all items with no filter', () => {
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
      store.add(event1);
      store.add(event2);

      const result = store.query();
      expect(result).toHaveLength(2);
    });

    it('should return all items with empty Filter object', () => {
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
      store.add(event1);
      store.add(event2);

      const result = store.query({});
      expect(result).toHaveLength(2);
    });
  });

  describe('combined filters', () => {
    beforeEach(() => {
      const event1: Event = {
        id: 'evt-1',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'hello important',
        subagent_id: 'subagent-1',
      };
      const event2: Event = {
        id: 'evt-2',
        type: 'assistant',
        timestamp: '2026-01-01T00:00:01Z',
        content: 'important response',
        subagent_id: 'subagent-1',
      };
      const event3: Event = {
        id: 'evt-3',
        type: 'user',
        timestamp: '2026-01-01T00:00:02Z',
        content: 'another message',
        subagent_id: 'subagent-2',
      };
      store.add(event1);
      store.add(event2);
      store.add(event3);
    });

    it('should combine type and subagentId filters', () => {
      const result = store.query({
        types: ['user'],
        subagentId: 'subagent-1',
      });
      expect(result).toHaveLength(1);
      expect((result[0] as Event).id).toBe('evt-1');
    });

    it('should combine type and keyword filters', () => {
      const result = store.query({
        types: ['assistant'],
        keyword: 'important',
      });
      expect(result).toHaveLength(1);
      expect((result[0] as Event).id).toBe('evt-2');
    });

    it('should combine all three filters', () => {
      const result = store.query({
        types: ['user'],
        subagentId: 'subagent-1',
        keyword: 'important',
      });
      expect(result).toHaveLength(1);
      const firstEvent = result[0] as Event;
      expect(firstEvent.id).toBe('evt-1');
    });

    it('should return empty when combined filters match nothing', () => {
      const result = store.query({
        types: ['tool_use'],
        subagentId: 'subagent-1',
        keyword: 'hello',
      });
      expect(result).toHaveLength(0);
    });
  });
});
