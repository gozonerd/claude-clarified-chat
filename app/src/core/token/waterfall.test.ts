import { describe, it, expect } from 'vitest';
import { EventStore } from '../store/store';
import { computeWaterfall } from './waterfall';
import type { Event } from '../../schemas/event';

describe('computeWaterfall', () => {
  it('should return empty waterfall for empty store', () => {
    const store = new EventStore();
    const result = computeWaterfall(store);
    expect(result.total).toEqual({ input: 0, output: 0 });
    expect(result.perEvent).toEqual([]);
    expect(result.perSubagent.size).toBe(0);
    expect(result.declared).toBeNull();
    expect(result.reconciliationPct).toBe(1);
  });

  it('should filter out non-event items (log, unavailable)', () => {
    const store = new EventStore();
    store.add({ kind: 'log', id: 'log1', timestamp: '2026-01-01T00:00:00Z', line: 'test', source_path: '' });
    store.add({ kind: 'unavailable', reason: 'not found', source_path: 'test.txt' });
    const result = computeWaterfall(store);
    expect(result.total).toEqual({ input: 0, output: 0 });
    expect(result.perEvent).toEqual([]);
  });

  it('should skip events without tokens', () => {
    const store = new EventStore();
    const ev1: Event = {
      id: 'e1',
      type: 'user',
      timestamp: '2026-01-01T00:00:00Z',
      content: 'hello',
    };
    store.add(ev1);
    const result = computeWaterfall(store);
    expect(result.total).toEqual({ input: 0, output: 0 });
    expect(result.perEvent).toEqual([]);
  });

  it('should aggregate tokens from events', () => {
    const store = new EventStore();
    const ev1: Event = {
      id: 'e1',
      type: 'user',
      timestamp: '2026-01-01T00:00:00Z',
      content: 'hello',
      tokens: { input: 10, output: 20 },
    };
    const ev2: Event = {
      id: 'e2',
      type: 'assistant',
      timestamp: '2026-01-01T00:00:01Z',
      content: 'hi',
      tokens: { input: 5, output: 15 },
    };
    store.add(ev1);
    store.add(ev2);
    const result = computeWaterfall(store);
    expect(result.total).toEqual({ input: 15, output: 35 });
    expect(result.perEvent).toHaveLength(2);
  });

  it('should track tokens per subagent', () => {
    const store = new EventStore();
    const ev1: Event = {
      id: 'e1',
      type: 'user',
      timestamp: '2026-01-01T00:00:00Z',
      content: 'hello',
      tokens: { input: 10, output: 20 },
      subagent_id: 'agent1',
    };
    const ev2: Event = {
      id: 'e2',
      type: 'assistant',
      timestamp: '2026-01-01T00:00:01Z',
      content: 'hi',
      tokens: { input: 5, output: 15 },
      subagent_id: 'agent1',
    };
    const ev3: Event = {
      id: 'e3',
      type: 'user',
      timestamp: '2026-01-01T00:00:02Z',
      content: 'bye',
      tokens: { input: 3, output: 7 },
      subagent_id: 'agent2',
    };
    store.add(ev1);
    store.add(ev2);
    store.add(ev3);
    const result = computeWaterfall(store);
    expect(result.perSubagent.get('agent1')).toEqual({ input: 15, output: 35 });
    expect(result.perSubagent.get('agent2')).toEqual({ input: 3, output: 7 });
    expect(result.perSubagent.size).toBe(2);
  });

  it('should not create subagent entry when subagent_id is undefined', () => {
    const store = new EventStore();
    const ev: Event = {
      id: 'e1',
      type: 'user',
      timestamp: '2026-01-01T00:00:00Z',
      content: 'hello',
      tokens: { input: 10, output: 20 },
    };
    store.add(ev);
    const result = computeWaterfall(store);
    expect(result.perSubagent.size).toBe(0);
  });

  it('should reconcile with declared tokens (matching)', () => {
    const store = new EventStore();
    const ev: Event = {
      id: 'e1',
      type: 'user',
      timestamp: '2026-01-01T00:00:00Z',
      content: 'hello',
      tokens: { input: 10, output: 20 },
    };
    store.add(ev);
    const declared = { input: 10, output: 20 };
    const result = computeWaterfall(store, declared);
    expect(result.declared).toEqual(declared);
    expect(result.reconciliationPct).toBe(1);
  });

  it('should reconcile with declared tokens (partial)', () => {
    const store = new EventStore();
    const ev: Event = {
      id: 'e1',
      type: 'user',
      timestamp: '2026-01-01T00:00:00Z',
      content: 'hello',
      tokens: { input: 10, output: 20 },
    };
    store.add(ev);
    const declared = { input: 20, output: 20 };
    const result = computeWaterfall(store, declared);
    expect(result.declared).toEqual(declared);
    expect(result.reconciliationPct).toBe(30 / 40); // (10+20) / (20+20)
  });

  it('should reconcile when declared is zero (and events have no tokens)', () => {
    const store = new EventStore();
    const declared = { input: 0, output: 0 };
    const result = computeWaterfall(store, declared);
    expect(result.reconciliationPct).toBe(1);
  });

  it('should reconcile when declared is zero (and events have tokens)', () => {
    const store = new EventStore();
    const ev: Event = {
      id: 'e1',
      type: 'user',
      timestamp: '2026-01-01T00:00:00Z',
      content: 'hello',
      tokens: { input: 10, output: 20 },
    };
    store.add(ev);
    const declared = { input: 0, output: 0 };
    const result = computeWaterfall(store, declared);
    expect(result.reconciliationPct).toBe(0);
  });

  it('should handle large token counts', () => {
    const store = new EventStore();
    const ev: Event = {
      id: 'e1',
      type: 'user',
      timestamp: '2026-01-01T00:00:00Z',
      content: 'hello',
      tokens: { input: 999999, output: 999999 },
    };
    store.add(ev);
    const result = computeWaterfall(store);
    expect(result.total).toEqual({ input: 999999, output: 999999 });
  });

  it('should preserve event order in perEvent', () => {
    const store = new EventStore();
    const ev1: Event = {
      id: 'e1',
      type: 'user',
      timestamp: '2026-01-01T00:00:00Z',
      content: 'first',
      tokens: { input: 1, output: 1 },
    };
    const ev2: Event = {
      id: 'e2',
      type: 'user',
      timestamp: '2026-01-01T00:00:01Z',
      content: 'second',
      tokens: { input: 2, output: 2 },
    };
    store.add(ev1);
    store.add(ev2);
    const result = computeWaterfall(store);
    expect(result.perEvent.length).toBeGreaterThanOrEqual(2);
    if (result.perEvent[0]) expect(result.perEvent[0].eventId).toBe('e1');
    if (result.perEvent[1]) expect(result.perEvent[1].eventId).toBe('e2');
  });

  it('should handle multiple events for same subagent', () => {
    const store = new EventStore();
    const ev1: Event = {
      id: 'e1',
      type: 'user',
      timestamp: '2026-01-01T00:00:00Z',
      content: 'msg1',
      tokens: { input: 100, output: 200 },
      subagent_id: 'bot',
    };
    const ev2: Event = {
      id: 'e2',
      type: 'assistant',
      timestamp: '2026-01-01T00:00:01Z',
      content: 'msg2',
      tokens: { input: 50, output: 100 },
      subagent_id: 'bot',
    };
    const ev3: Event = {
      id: 'e3',
      type: 'user',
      timestamp: '2026-01-01T00:00:02Z',
      content: 'msg3',
      tokens: { input: 25, output: 50 },
      subagent_id: 'bot',
    };
    store.add(ev1);
    store.add(ev2);
    store.add(ev3);
    const result = computeWaterfall(store);
    const botTokens = result.perSubagent.get('bot');
    expect(botTokens).toBeDefined();
    if (botTokens) {
      expect(botTokens.input).toBe(175);
      expect(botTokens.output).toBe(350);
    }
  });
});
