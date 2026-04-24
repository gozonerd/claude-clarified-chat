import { describe, it, expect, beforeEach } from 'vitest';
import { EventStore } from '../store/store';
import { exportMarkdown } from './md';
import type { Event } from '../../schemas/event';
import type { Waterfall } from '../token/types';

describe('exportMarkdown', () => {
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

  it('empty store produces markdown with zero Events', () => {
    const md = exportMarkdown(store, baseWaterfall);
    expect(md).toContain('# Claude Clarified Chat — Clarity Corpus');
    expect(md).toContain('- Events: 0');
  });

  it('export with events produces markdown with event sections', () => {
    const event: Event = {
      id: 'evt-1',
      timestamp: '2026-04-22T10:00:00Z',
      type: 'user',
      content: 'hello',
      tokens: { input: 100, output: 50 },
    };
    store.add(event);
    const waterfall: Waterfall = {
      total: { input: 100, output: 50 },
      perEvent: [{ eventId: 'evt-1', tokens: { input: 100, output: 50 } }],
      perSubagent: new Map(),
      declared: null,
      reconciliationPct: 0.95,
    };
    const md = exportMarkdown(store, waterfall);
    expect(md).toContain('### 2026-04-22T10:00:00Z — user (evt-1)');
    expect(md).toContain('Tokens: input=100 output=50');
  });

  it('export with event content as object stringifies it', () => {
    const event: Event = {
      id: 'evt-1',
      timestamp: '2026-04-22T10:00:00Z',
      type: 'assistant',
      content: { role: 'assistant', text: 'response' },
    };
    store.add(event);
    const md = exportMarkdown(store, baseWaterfall);
    expect(md).toContain('"role"');
    expect(md).toContain('"assistant"');
  });

  it('export with event containing subagent_id shows it', () => {
    const event: Event = {
      id: 'evt-1',
      timestamp: '2026-04-22T10:00:00Z',
      type: 'user',
      content: 'hello',
      subagent_id: 'agent-123',
    };
    store.add(event);
    const md = exportMarkdown(store, baseWaterfall);
    expect(md).toContain('Sub-agent: agent-123');
  });

  it('export with logs includes Logs section', () => {
    store.add({
      kind: 'log',
      id: 'log-1',
      timestamp: '2026-04-22T11:00:00Z',
      line: 'debug message',
      source_path: '/logs/app.log',
    });
    const md = exportMarkdown(store, baseWaterfall);
    expect(md).toContain('## Logs');
    expect(md).toContain('/logs/app.log');
    expect(md).toContain('debug message');
  });

  it('export with NO logs does not include Logs section', () => {
    store.add({
      id: 'evt-1',
      timestamp: '2026-04-22T10:00:00Z',
      type: 'user',
      content: 'hello',
    });
    const md = exportMarkdown(store, baseWaterfall);
    expect(md).not.toContain('## Logs\n\n');
  });

  it('export with unavailable markers counts them', () => {
    store.add({
      kind: 'unavailable',
      reason: 'missing file',
      source_path: '/data/missing.json',
    });
    const md = exportMarkdown(store, baseWaterfall);
    expect(md).toContain('- Unavailable markers: 1');
  });

  it('export with subagent waterfall includes Per Sub-Agent section', () => {
    const map = new Map<string, { input: number; output: number }>();
    map.set('agent-1', { input: 50, output: 25 });
    const waterfall: Waterfall = {
      total: { input: 100, output: 50 },
      perEvent: [],
      perSubagent: map,
      declared: null,
      reconciliationPct: 0.95,
    };
    const md = exportMarkdown(store, waterfall);
    expect(md).toContain('### Per Sub-Agent');
    expect(md).toContain('agent-1');
  });

  it('export with no subagent waterfall omits Per Sub-Agent section', () => {
    const waterfall: Waterfall = {
      total: { input: 100, output: 50 },
      perEvent: [],
      perSubagent: new Map(),
      declared: null,
      reconciliationPct: 0.95,
    };
    const md = exportMarkdown(store, waterfall);
    expect(md).not.toContain('### Per Sub-Agent');
  });

  it('stringify handles string content', () => {
    const event: Event = {
      id: 'evt-1',
      timestamp: '2026-04-22T10:00:00Z',
      type: 'user',
      content: 'plain string',
    };
    store.add(event);
    const md = exportMarkdown(store, baseWaterfall);
    expect(md).toContain('plain string');
  });

  it('stringify handles null/undefined content', () => {
    const event: Event = {
      id: 'evt-1',
      timestamp: '2026-04-22T10:00:00Z',
      type: 'user',
      content: null,
    };
    store.add(event);
    const md = exportMarkdown(store, baseWaterfall);
    expect(md).toContain('```\n\n```');
  });

  it('stringify handles circular reference error in catch', () => {
    // Create a circular reference
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj: any = { a: 1 };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    obj.self = obj;
    const event: Event = {
      id: 'evt-1',
      timestamp: '2026-04-22T10:00:00Z',
      type: 'user',
      content: obj,
    };
    store.add(event);
    const md = exportMarkdown(store, baseWaterfall);
    // When stringify catches circular reference error, it falls back to String(content) = [object Object]
    expect(md).toContain('[object Object]');
  });
});
