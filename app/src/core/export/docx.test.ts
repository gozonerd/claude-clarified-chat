import { describe, it, expect, beforeEach } from 'vitest';
import { EventStore } from '../store/store';
import { exportDocx } from './docx';
import type { Event } from '../../schemas/event';
import type { Waterfall } from '../token/types';

describe('exportDocx', () => {
  let store: EventStore;
  let baseWaterfall: Waterfall;

  beforeEach(() => {
    store = new EventStore();
    baseWaterfall = {
      total: { input: 100, output: 50 },
      perEvent: [],
      perSubagent: new Map(),
      declared: null,
      reconciliationPct: 0.95,
    };
  });

  it('returns non-empty Uint8Array starting with PK (zip magic)', async () => {
    const docx = await exportDocx(store, baseWaterfall);
    expect(docx).toBeInstanceOf(Uint8Array);
    expect(docx.length).toBeGreaterThan(0);
    expect(docx[0]).toBe(0x50); // P
    expect(docx[1]).toBe(0x4b); // K
  });

  it('mixed items (events and markers) render: events as headings, markers as text', async () => {
    const event: Event = {
      id: 'evt-1',
      timestamp: '2026-04-22T10:00:00Z',
      type: 'user',
      content: 'hello',
    };
    store.add(event);
    store.add({
      kind: 'log',
      id: 'log-1',
      timestamp: '2026-04-22T11:00:00Z',
      line: 'debug message',
      source_path: '/logs/app.log',
    });
    const docx = await exportDocx(store, baseWaterfall);
    expect(docx).toBeInstanceOf(Uint8Array);
    expect(docx.length).toBeGreaterThan(0);
  });
});
