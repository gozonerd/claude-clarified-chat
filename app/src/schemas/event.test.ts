import { describe, it, expect } from 'vitest';
import {
  RawEventSchema,
  ContentBlockSchema,
  EventSchema,
} from './event';
import {
  loadRealExportJsonlLines,
  realExportFixturesPresent,
} from '../__fixtures__/loadRealExport';

const fixturesPresent = realExportFixturesPresent();

describe('RawEventSchema — empirical Claude Desktop shape', () => {
  describe.runIf(fixturesPresent)('against 3 real export JSONL files', () => {
    const fixtures = [
      'export-small-1776882591631',
      'export-mid-1777064512813',
      'export-large-1777095820500',
    ] as const;

    for (const name of fixtures) {
      it(`accepts every line in ${name}`, () => {
        const lines = loadRealExportJsonlLines(name);
        expect(lines.length).toBeGreaterThan(0);
        let parsed = 0;
        let firstFailure: string | null = null;
        for (const line of lines) {
          const obj: unknown = JSON.parse(line);
          const result = RawEventSchema.safeParse(obj);
          if (result.success) {
            parsed++;
          } else if (firstFailure === null) {
            firstFailure = `line "${line.slice(0, 200)}" → ${result.error.message}`;
          }
        }
        expect({ parsed, total: lines.length, firstFailure }).toEqual({
          parsed: lines.length,
          total: lines.length,
          firstFailure: null,
        });
      });
    }
  });

  describe.runIf(fixturesPresent)('discriminator coverage', () => {
    it('parses every type variant we model', () => {
      const lines = loadRealExportJsonlLines('export-large-1777095820500');
      const seen = new Set<string>();
      for (const line of lines) {
        const obj = JSON.parse(line) as { type?: string };
        const r = RawEventSchema.safeParse(obj);
        if (r.success) seen.add(r.data.type);
      }
      expect(seen).toEqual(
        new Set([
          'user',
          'assistant',
          'system',
          'queue-operation',
          'last-prompt',
          'custom-title',
          'attachment',
        ]),
      );
    });
  });

  describe('rejection — wrong shapes', () => {
    it('rejects an object missing the type discriminator', () => {
      const r = RawEventSchema.safeParse({ uuid: 'x', sessionId: 's' });
      expect(r.success).toBe(false);
    });

    it('rejects an unknown type value', () => {
      const r = RawEventSchema.safeParse({
        type: 'made-up-type',
        sessionId: 's',
      });
      expect(r.success).toBe(false);
    });

    it('rejects user event with missing message', () => {
      const r = RawEventSchema.safeParse({
        type: 'user',
        uuid: 'u',
        parentUuid: null,
        isSidechain: false,
        timestamp: '2026-01-01T00:00:00Z',
        sessionId: 's',
      });
      expect(r.success).toBe(false);
    });

    it('rejects user event whose message has wrong role', () => {
      const r = RawEventSchema.safeParse({
        type: 'user',
        uuid: 'u',
        parentUuid: null,
        isSidechain: false,
        timestamp: '2026-01-01T00:00:00Z',
        sessionId: 's',
        message: { role: 'assistant', content: 'oops' },
      });
      expect(r.success).toBe(false);
    });

    it('rejects assistant event whose message.content is a string (must be array)', () => {
      const r = RawEventSchema.safeParse({
        type: 'assistant',
        uuid: 'u',
        parentUuid: null,
        isSidechain: false,
        timestamp: '2026-01-01T00:00:00Z',
        sessionId: 's',
        message: { role: 'assistant', content: 'flat string forbidden here' },
      });
      expect(r.success).toBe(false);
    });
  });

  describe('forward-compat passthrough', () => {
    it('allows unknown top-level fields on conversational events', () => {
      const r = RawEventSchema.safeParse({
        type: 'user',
        uuid: 'u',
        parentUuid: null,
        isSidechain: false,
        timestamp: '2026-01-01T00:00:00Z',
        sessionId: 's',
        message: { role: 'user', content: 'hi' },
        someFutureField: { deeply: 'nested' },
      });
      expect(r.success).toBe(true);
    });
  });
});

describe('ContentBlockSchema', () => {
  it('parses a text block', () => {
    const r = ContentBlockSchema.safeParse({ type: 'text', text: 'hello' });
    expect(r.success).toBe(true);
  });

  it('parses a thinking block', () => {
    const r = ContentBlockSchema.safeParse({
      type: 'thinking',
      thinking: 'reasoning',
      signature: 'sig',
    });
    expect(r.success).toBe(true);
  });

  it('parses a tool_use block', () => {
    const r = ContentBlockSchema.safeParse({
      type: 'tool_use',
      id: 'toolu_x',
      name: 'Read',
      input: { file_path: '/x' },
    });
    expect(r.success).toBe(true);
  });

  it('parses a tool_result block', () => {
    const r = ContentBlockSchema.safeParse({
      type: 'tool_result',
      tool_use_id: 'toolu_x',
      content: 'output',
    });
    expect(r.success).toBe(true);
  });

  it('rejects a tool_use block missing id', () => {
    const r = ContentBlockSchema.safeParse({
      type: 'tool_use',
      name: 'Read',
      input: {},
    });
    expect(r.success).toBe(false);
  });

  it('rejects an unknown block type', () => {
    const r = ContentBlockSchema.safeParse({ type: 'image', src: 'x' });
    expect(r.success).toBe(false);
  });
});

describe('EventSchema (alias for RawEventSchema)', () => {
  it('is the same schema as RawEventSchema for legacy imports', () => {
    expect(EventSchema).toBe(RawEventSchema);
  });
});
