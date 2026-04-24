import { describe, it, expect } from 'vitest';
import { EventStore } from '../store/store';
import type { Event } from '../../schemas/event';
import { computeWaterfall } from './waterfall';

describe('computeWaterfall', () => {
  it('empty store → total {0,0}, perEvent [], perSubagent empty Map, declared null → reconciliationPct = 1', () => {
    const store = new EventStore();
    const result = computeWaterfall(store);
    expect(result.total).toEqual({ input: 0, output: 0 });
    expect(result.perEvent).toEqual([]);
    expect(result.perSubagent.size).toBe(0);
    expect(result.declared).toBeNull();
    expect(result.reconciliationPct).toBe(1);
  });

  it('events with tokens summing correctly → total matches', () => {
    const store = new EventStore();
    const ev1: Event = {
      id: 'ev1',
      type: 'user',
      timestamp: '2024-01-01T00:00:00Z',
      content: 'test',
      tokens: { input: 50, output: 25 },
    };
    const ev2: Event = {
      id: 'ev2',
      type: 'assistant',
      timestamp: '2024-01-01T00:01:00Z',
      content: 'response',
      tokens: { input: 30, output: 40 },
    };
    store.add(ev1);
    store.add(ev2);

    const result = computeWaterfall(store);
    expect(result.total).toEqual({ input: 80, output: 65 });
    expect(result.perEvent).toHaveLength(2);
    expect(result.perEvent[0]).toEqual({
      eventId: 'ev1',
      tokens: { input: 50, output: 25 },
    });
    expect(result.perEvent[1]).toEqual({
      eventId: 'ev2',
      tokens: { input: 30, output: 40 },
    });
  });

  it('events without tokens skipped (no contribution)', () => {
    const store = new EventStore();
    const ev1: Event = {
      id: 'ev1',
      type: 'user',
      timestamp: '2024-01-01T00:00:00Z',
      content: 'test',
      tokens: { input: 50, output: 25 },
    };
    const ev2: Event = {
      id: 'ev2',
      type: 'assistant',
      timestamp: '2024-01-01T00:01:00Z',
      content: 'response',
    };
    store.add(ev1);
    store.add(ev2);

    const result = computeWaterfall(store);
    expect(result.total).toEqual({ input: 50, output: 25 });
    expect(result.perEvent).toHaveLength(1);
    const first = result.perEvent[0];
    expect(first).toBeDefined();
    if (first) {
      expect(first.eventId).toBe('ev1');
    }
  });

  it('subagent_id present → perSubagent updated; multiple events same subagent → tokens accumulate', () => {
    const store = new EventStore();
    const ev1: Event = {
      id: 'ev1',
      type: 'user',
      timestamp: '2024-01-01T00:00:00Z',
      content: 'test',
      tokens: { input: 50, output: 25 },
      subagent_id: 'agent1',
    };
    const ev2: Event = {
      id: 'ev2',
      type: 'assistant',
      timestamp: '2024-01-01T00:01:00Z',
      content: 'response',
      tokens: { input: 30, output: 40 },
      subagent_id: 'agent1',
    };
    const ev3: Event = {
      id: 'ev3',
      type: 'tool_use',
      timestamp: '2024-01-01T00:02:00Z',
      content: 'tool',
      tokens: { input: 10, output: 5 },
      subagent_id: 'agent2',
    };
    store.add(ev1);
    store.add(ev2);
    store.add(ev3);

    const result = computeWaterfall(store);
    expect(result.perSubagent.get('agent1')).toEqual({ input: 80, output: 65 });
    expect(result.perSubagent.get('agent2')).toEqual({ input: 10, output: 5 });
    expect(result.perSubagent.size).toBe(2);
  });

  it('declared null → reconciliationPct = 1 regardless of summed total', () => {
    const store = new EventStore();
    const ev1: Event = {
      id: 'ev1',
      type: 'user',
      timestamp: '2024-01-01T00:00:00Z',
      content: 'test',
      tokens: { input: 100, output: 50 },
    };
    store.add(ev1);

    const result = computeWaterfall(store, null);
    expect(result.reconciliationPct).toBe(1);
  });

  it('declared {input:100, output:100} and computed sum {input:50, output:50} → reconciliationPct = 0.5', () => {
    const store = new EventStore();
    const ev1: Event = {
      id: 'ev1',
      type: 'user',
      timestamp: '2024-01-01T00:00:00Z',
      content: 'test',
      tokens: { input: 50, output: 50 },
    };
    store.add(ev1);

    const result = computeWaterfall(store, { input: 100, output: 100 });
    expect(result.reconciliationPct).toBe(0.5);
  });

  it('declared {input:0, output:0} and computed sum {input:0, output:0} → reconciliationPct = 1', () => {
    const store = new EventStore();
    const ev1: Event = {
      id: 'ev1',
      type: 'user',
      timestamp: '2024-01-01T00:00:00Z',
      content: 'test',
    };
    store.add(ev1);

    const result = computeWaterfall(store, { input: 0, output: 0 });
    expect(result.reconciliationPct).toBe(1);
  });

  it('declared {input:0, output:0} and computed sum > 0 → reconciliationPct = 0', () => {
    const store = new EventStore();
    const ev1: Event = {
      id: 'ev1',
      type: 'user',
      timestamp: '2024-01-01T00:00:00Z',
      content: 'test',
      tokens: { input: 10, output: 5 },
    };
    store.add(ev1);

    const result = computeWaterfall(store, { input: 0, output: 0 });
    expect(result.reconciliationPct).toBe(0);
  });

  it('items in store that are unavailable markers / log entries → skipped', () => {
    const store = new EventStore();
    const ev1: Event = {
      id: 'ev1',
      type: 'user',
      timestamp: '2024-01-01T00:00:00Z',
      content: 'test',
      tokens: { input: 50, output: 25 },
    };
    store.add(ev1);
    store.add({
      kind: 'unavailable' as const,
      reason: 'file not found',
      source_path: '/some/path',
    });
    store.add({
      kind: 'log' as const,
      id: 'log1',
      timestamp: '2024-01-01T00:03:00Z',
      line: 'some log line',
      source_path: '/logs',
    });

    const result = computeWaterfall(store);
    expect(result.total).toEqual({ input: 50, output: 25 });
    expect(result.perEvent).toHaveLength(1);
  });

  it('event with subagent_id undefined → does not populate perSubagent', () => {
    const store = new EventStore();
    const ev1: Event = {
      id: 'ev1',
      type: 'user',
      timestamp: '2024-01-01T00:00:00Z',
      content: 'test',
      tokens: { input: 50, output: 25 },
    };
    store.add(ev1);

    const result = computeWaterfall(store);
    expect(result.perSubagent.size).toBe(0);
  });

  it('reconciliation with declared tokens larger than actual sum', () => {
    const store = new EventStore();
    const ev1: Event = {
      id: 'ev1',
      type: 'user',
      timestamp: '2024-01-01T00:00:00Z',
      content: 'test',
      tokens: { input: 25, output: 10 },
    };
    store.add(ev1);

    const result = computeWaterfall(store, { input: 100, output: 100 });
    expect(result.reconciliationPct).toBeCloseTo(0.175, 2);
  });

  it('multiple subagents with overlapping token values', () => {
    const store = new EventStore();
    for (let i = 0; i < 3; i++) {
      const iStr = String(i);
      const hour = i < 10 ? `0${iStr}` : iStr;
      store.add({
        id: `ev${iStr}`,
        type: 'user' as const,
        timestamp: `2024-01-01T00:${hour}:00Z`,
        content: 'test',
        tokens: { input: 20, output: 10 },
        subagent_id: i % 2 === 0 ? 'agent1' : 'agent2',
      });
    }

    const result = computeWaterfall(store);
    expect(result.perSubagent.get('agent1')).toEqual({ input: 40, output: 20 });
    expect(result.perSubagent.get('agent2')).toEqual({ input: 20, output: 10 });
  });
});
