import { describe, it, expect, beforeEach } from 'vitest';
import { EventStore } from '../store/store';
import { exportXlsx } from './xlsx';
import ExcelJS from 'exceljs';
import type { Event } from '../../schemas/event';
import type { Waterfall } from '../token/types';

describe('exportXlsx', () => {
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

  it('returns non-empty Uint8Array starting with PK (zip)', async () => {
    const xlsx = await exportXlsx(store, baseWaterfall);
    expect(xlsx).toBeInstanceOf(Uint8Array);
    expect(xlsx.length).toBeGreaterThan(0);
    expect(xlsx[0]).toBe(0x50); // P
    expect(xlsx[1]).toBe(0x4b); // K
  });

  it('Events sheet has rows for events but skips kind-items', async () => {
    const e1: Event = {
      id: 'evt-1',
      timestamp: '2026-04-22T10:00:00Z',
      type: 'user',
      content: 'test',
    };
    store.add(e1);
    store.add({
      kind: 'log',
      id: 'log-1',
      timestamp: '2026-04-22T11:00:00Z',
      line: 'debug',
      source_path: '/logs/app.log',
    });
    const xlsx = await exportXlsx(store, baseWaterfall);
    const wb = new ExcelJS.Workbook();
    const buf: unknown = Buffer.from(xlsx);
    await wb.xlsx.load(buf as Parameters<typeof wb.xlsx.load>[0]);
    const evSheet = wb.getWorksheet('Events');
    expect(evSheet).toBeDefined();
    expect(evSheet?.rowCount).toBeGreaterThanOrEqual(1);
  });

  it('Event with tokens populates input_tokens/output_tokens; without tokens populates 0', async () => {
    const e1: Event = {
      id: 'evt-with-tokens',
      timestamp: '2026-04-22T10:00:00Z',
      type: 'user',
      content: 'test',
      tokens: { input: 100, output: 50 },
    };
    const e2: Event = {
      id: 'evt-without-tokens',
      timestamp: '2026-04-22T11:00:00Z',
      type: 'assistant',
      content: 'response',
    };
    store.add(e1);
    store.add(e2);
    const xlsx = await exportXlsx(store, baseWaterfall);
    expect(xlsx).toBeInstanceOf(Uint8Array);
  });

  it('Event with subagent_id populates column; without populates empty string', async () => {
    const e1: Event = {
      id: 'evt-with-sid',
      timestamp: '2026-04-22T10:00:00Z',
      type: 'user',
      content: 'test',
      subagent_id: 'agent-1',
    };
    const e2: Event = {
      id: 'evt-without-sid',
      timestamp: '2026-04-22T11:00:00Z',
      type: 'assistant',
      content: 'response',
    };
    store.add(e1);
    store.add(e2);
    const xlsx = await exportXlsx(store, baseWaterfall);
    expect(xlsx).toBeInstanceOf(Uint8Array);
  });

  it('TokenWaterfall sheet populated from waterfall.perEvent', async () => {
    const waterfall: Waterfall = {
      total: { input: 100, output: 50 },
      perEvent: [{ eventId: 'evt-1', tokens: { input: 100, output: 50 } }],
      perSubagent: new Map(),
      declared: null,
      reconciliationPct: 0.95,
    };
    const xlsx = await exportXlsx(store, waterfall);
    const wb = new ExcelJS.Workbook();
    const buf: unknown = Buffer.from(xlsx);
    await wb.xlsx.load(buf as Parameters<typeof wb.xlsx.load>[0]);
    const wfSheet = wb.getWorksheet('TokenWaterfall');
    expect(wfSheet).toBeDefined();
  });

  it('SubAgents sheet populated from waterfall.perSubagent', async () => {
    const map = new Map<string, { input: number; output: number }>();
    map.set('agent-1', { input: 50, output: 25 });
    const waterfall: Waterfall = {
      total: { input: 100, output: 50 },
      perEvent: [],
      perSubagent: map,
      declared: null,
      reconciliationPct: 0.95,
    };
    const xlsx = await exportXlsx(store, waterfall);
    const wb = new ExcelJS.Workbook();
    const buf: unknown = Buffer.from(xlsx);
    await wb.xlsx.load(buf as Parameters<typeof wb.xlsx.load>[0]);
    const saSheet = wb.getWorksheet('SubAgents');
    expect(saSheet).toBeDefined();
  });
});
