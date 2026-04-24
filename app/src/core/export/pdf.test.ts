import { describe, it, expect, beforeEach } from 'vitest';
import { EventStore } from '../store/store';
import { exportPdf } from './pdf';
import { PDFDocument } from 'pdf-lib';
import type { Event } from '../../schemas/event';
import type { Waterfall } from '../token/types';

describe('exportPdf', () => {
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

  it('returns Uint8Array starting with PDF magic bytes', async () => {
    const pdf = await exportPdf(store, baseWaterfall);
    expect(pdf).toBeInstanceOf(Uint8Array);
    expect(pdf[0]).toBe(0x25); // %
    expect(pdf[1]).toBe(0x50); // P
    expect(pdf[2]).toBe(0x44); // D
    expect(pdf[3]).toBe(0x46); // F
  });

  it('empty store produces valid PDF', async () => {
    const pdf = await exportPdf(store, baseWaterfall);
    expect(pdf).toBeInstanceOf(Uint8Array);
    expect(pdf.length).toBeGreaterThan(0);
  });

  it('many items trigger pagination (>60 to wrap)', async () => {
    for (let i = 0; i < 70; i++) {
      const event: Event = {
        id: `evt-${String(i)}`,
        timestamp: `2026-04-22T${String(i % 24).padStart(2, '0')}:00:00Z`,
        type: 'user',
        content: `msg ${String(i)}`,
      };
      store.add(event);
    }
    const pdf = await exportPdf(store, baseWaterfall);
    const doc = await PDFDocument.load(pdf);
    expect(doc.getPageCount()).toBeGreaterThan(1);
  });

  it('items with mixed kinds (log, unavailable, event) render', async () => {
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
    store.add({
      kind: 'unavailable',
      reason: 'missing file',
      source_path: '/data/missing.json',
    });
    const pdf = await exportPdf(store, baseWaterfall);
    expect(pdf).toBeInstanceOf(Uint8Array);
    expect(pdf.length).toBeGreaterThan(0);
  });
});
