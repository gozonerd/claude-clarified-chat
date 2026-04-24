import { describe, it, expect, beforeEach } from 'vitest';
import { EventStore } from '../store/store';
import { exportAll } from './exporter';
import { SecretAckRequiredError } from './types';
import type { Event } from '../../schemas/event';
import type { Waterfall } from '../token/types';

describe('exportAll', () => {
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

  it('exportAll with empty store + no detections + secretAck=false returns artifacts', async () => {
    const artifacts = await exportAll(store, baseWaterfall, false);
    expect(artifacts).toHaveProperty('pdf');
    expect(artifacts).toHaveProperty('docx');
    expect(artifacts).toHaveProperty('xlsx');
    expect(artifacts).toHaveProperty('md');
    expect(artifacts.pdf).toBeInstanceOf(Uint8Array);
    expect(artifacts.docx).toBeInstanceOf(Uint8Array);
    expect(artifacts.xlsx).toBeInstanceOf(Uint8Array);
    expect(typeof artifacts.md).toBe('string');
    expect(artifacts.pdf.length).toBeGreaterThan(0);
    expect(artifacts.docx.length).toBeGreaterThan(0);
    expect(artifacts.xlsx.length).toBeGreaterThan(0);
    expect(artifacts.md.length).toBeGreaterThan(0);
  });

  it('exportAll with events containing detected secret + secretAck=false throws SecretAckRequiredError with detectionCount', async () => {
    const event: Event = {
      id: 'evt-secret',
      timestamp: '2026-04-22T10:00:00Z',
      type: 'user',
      content: 'sk-ant-this-is-a-fake-key-for-testing',
    };
    store.add(event);

    try {
      await exportAll(store, baseWaterfall, false);
      expect.fail('Should have thrown SecretAckRequiredError');
    } catch (err) {
      expect(err).toBeInstanceOf(SecretAckRequiredError);
      const error = err as SecretAckRequiredError;
      expect(error.detectionCount).toBeGreaterThan(0);
      expect(error.name).toBe('SecretAckRequiredError');
    }
  });

  it('exportAll with secretAck=true even with detections present returns artifacts', async () => {
    const event: Event = {
      id: 'evt-secret',
      timestamp: '2026-04-22T10:00:00Z',
      type: 'user',
      content: 'password=super_secret_123',
    };
    store.add(event);

    const artifacts = await exportAll(store, baseWaterfall, true);
    expect(artifacts.pdf).toBeInstanceOf(Uint8Array);
    expect(artifacts.docx).toBeInstanceOf(Uint8Array);
    expect(artifacts.xlsx).toBeInstanceOf(Uint8Array);
    expect(typeof artifacts.md).toBe('string');
  });

  it('returned artifacts have non-empty pdf/docx/xlsx and non-empty md', async () => {
    const event: Event = {
      id: 'evt-1',
      timestamp: '2026-04-22T10:00:00Z',
      type: 'user',
      content: 'test content',
    };
    store.add(event);

    const artifacts = await exportAll(store, baseWaterfall, false);
    expect(artifacts.pdf.length).toBeGreaterThan(0);
    expect(artifacts.docx.length).toBeGreaterThan(0);
    expect(artifacts.xlsx.length).toBeGreaterThan(0);
    expect(artifacts.md.length).toBeGreaterThan(0);
  });
});
