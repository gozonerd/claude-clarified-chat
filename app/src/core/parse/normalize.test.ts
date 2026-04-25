import { describe, it, expect } from 'vitest';
import { normalize } from './normalize';
import { RawEventSchema } from '../../schemas/event';
import {
  loadRealExportJsonlLines,
  realExportFixturesPresent,
} from '../../__fixtures__/loadRealExport';

const fixturesPresent = realExportFixturesPresent();

function parseLine(line: string) {
  const r = RawEventSchema.safeParse(JSON.parse(line));
  if (!r.success) throw new Error(`fixture line failed schema: ${r.error.message}`);
  return r.data;
}

describe('normalize', () => {
  describe('user events', () => {
    it('flattens a user event with string content into one DisplayEvent', () => {
      const raw = parseLine(JSON.stringify({
        type: 'user',
        uuid: 'u-1',
        parentUuid: null,
        isSidechain: false,
        timestamp: '2026-01-01T00:00:00Z',
        sessionId: 's',
        message: { role: 'user', content: 'hello there' },
      }));
      const out = normalize(raw, 'a.jsonl');
      expect(out).toHaveLength(1);
      expect(out[0]?.id).toBe('u-1');
      expect(out[0]?.type).toBe('user');
      expect(out[0]?.content).toBe('hello there');
      expect(out[0]?.source_path).toBe('a.jsonl');
    });

    it('flattens a user event with array message.content (tool_result block) into one DisplayEvent per block', () => {
      const raw = parseLine(JSON.stringify({
        type: 'user',
        uuid: 'u-2',
        parentUuid: 'p-1',
        isSidechain: false,
        timestamp: '2026-01-01T00:00:00Z',
        sessionId: 's',
        message: {
          role: 'user',
          content: [
            { type: 'tool_result', tool_use_id: 'toolu_1', content: 'result body', is_error: false },
          ],
        },
      }));
      const out = normalize(raw);
      expect(out).toHaveLength(1);
      expect(out[0]?.id).toBe('u-2#0');
      expect(out[0]?.type).toBe('tool_result');
    });

    it('routes sidechain events under parentUuid as subagent_id', () => {
      const raw = parseLine(JSON.stringify({
        type: 'user',
        uuid: 'u-3',
        parentUuid: 'parent-uuid-here',
        isSidechain: true,
        timestamp: '2026-01-01T00:00:00Z',
        sessionId: 's',
        message: { role: 'user', content: 'hi from sidechain' },
      }));
      const out = normalize(raw);
      expect(out[0]?.subagent_id).toBe('parent-uuid-here');
    });

    it('emits a placeholder when message.content is an empty array', () => {
      const raw = parseLine(JSON.stringify({
        type: 'user',
        uuid: 'u-4',
        parentUuid: null,
        isSidechain: false,
        timestamp: '2026-01-01T00:00:00Z',
        sessionId: 's',
        message: { role: 'user', content: [] },
      }));
      const out = normalize(raw);
      expect(out).toHaveLength(1);
      expect(out[0]?.id).toBe('u-4');
      expect(out[0]?.content).toBe('');
    });
  });

  describe('assistant events', () => {
    it('flattens a multi-block assistant message into per-block DisplayEvents', () => {
      const raw = parseLine(JSON.stringify({
        type: 'assistant',
        uuid: 'a-1',
        parentUuid: 'p',
        isSidechain: false,
        timestamp: '2026-01-01T00:00:00Z',
        sessionId: 's',
        message: {
          role: 'assistant',
          content: [
            { type: 'thinking', thinking: 'reasoning' },
            { type: 'text', text: 'response text' },
            { type: 'tool_use', id: 'toolu_x', name: 'Read', input: { file_path: '/x' } },
          ],
          usage: { input_tokens: 100, output_tokens: 50 },
        },
      }));
      const out = normalize(raw);
      expect(out).toHaveLength(3);
      expect(out[0]?.type).toBe('thinking');
      expect(out[1]?.type).toBe('assistant');
      expect(out[2]?.type).toBe('tool_use');
      expect(out[0]?.tokens).toEqual({ input: 100, output: 50 });
      expect(out[1]?.tokens).toBeUndefined();
      expect(out[2]?.tokens).toBeUndefined();
    });

    it('handles empty assistant content array with placeholder', () => {
      const raw = parseLine(JSON.stringify({
        type: 'assistant',
        uuid: 'a-2',
        parentUuid: 'p',
        isSidechain: false,
        timestamp: '2026-01-01T00:00:00Z',
        sessionId: 's',
        message: { role: 'assistant', content: [] },
      }));
      const out = normalize(raw);
      expect(out).toHaveLength(1);
      expect(out[0]?.id).toBe('a-2');
      expect(out[0]?.content).toBe('');
    });

    it('omits tokens when usage has no numeric fields', () => {
      const raw = parseLine(JSON.stringify({
        type: 'assistant',
        uuid: 'a-3',
        parentUuid: 'p',
        isSidechain: false,
        timestamp: '2026-01-01T00:00:00Z',
        sessionId: 's',
        message: {
          role: 'assistant',
          content: [{ type: 'text', text: 'x' }],
          usage: { service_tier: 'standard' },
        },
      }));
      const out = normalize(raw);
      expect(out[0]?.tokens).toBeUndefined();
    });

    it('partial usage (only output_tokens) yields input=0', () => {
      const raw = parseLine(JSON.stringify({
        type: 'assistant',
        uuid: 'a-5',
        parentUuid: 'p',
        isSidechain: false,
        timestamp: '2026-01-01T00:00:00Z',
        sessionId: 's',
        message: {
          role: 'assistant',
          content: [{ type: 'text', text: 'x' }],
          usage: { output_tokens: 7 },
        },
      }));
      const out = normalize(raw);
      expect(out[0]?.tokens).toEqual({ input: 0, output: 7 });
    });

    it('null usage yields no tokens', () => {
      const raw = parseLine(JSON.stringify({
        type: 'assistant',
        uuid: 'a-6',
        parentUuid: 'p',
        isSidechain: false,
        timestamp: '2026-01-01T00:00:00Z',
        sessionId: 's',
        message: {
          role: 'assistant',
          content: [{ type: 'text', text: 'x' }],
          usage: null,
        },
      }));
      const out = normalize(raw);
      expect(out[0]?.tokens).toBeUndefined();
    });

    it('partial usage (only input_tokens) yields output=0', () => {
      const raw = parseLine(JSON.stringify({
        type: 'assistant',
        uuid: 'a-4',
        parentUuid: 'p',
        isSidechain: false,
        timestamp: '2026-01-01T00:00:00Z',
        sessionId: 's',
        message: {
          role: 'assistant',
          content: [{ type: 'text', text: 'x' }],
          usage: { input_tokens: 5 },
        },
      }));
      const out = normalize(raw);
      expect(out[0]?.tokens).toEqual({ input: 5, output: 0 });
    });
  });

  describe('system events', () => {
    it('maps a system event 1:1 with extracted hook fields', () => {
      const raw = parseLine(JSON.stringify({
        type: 'system',
        uuid: 'sys-1',
        sessionId: 's',
        timestamp: '2026-01-01T00:00:00Z',
        subtype: 'stop_hook_summary',
        hookCount: 3,
        level: 'suggestion',
        preventedContinuation: false,
      }));
      const out = normalize(raw);
      expect(out).toHaveLength(1);
      expect(out[0]?.type).toBe('system');
      expect(out[0]?.id).toBe('sys-1');
      expect((out[0]?.content as { subtype?: string }).subtype).toBe('stop_hook_summary');
      expect((out[0]?.content as { hookCount?: number }).hookCount).toBe(3);
    });

    it('handles system event missing timestamp', () => {
      const raw = parseLine(JSON.stringify({
        type: 'system',
        uuid: 'sys-2',
        sessionId: 's',
      }));
      const out = normalize(raw);
      expect(out[0]?.timestamp).toBe('');
    });
  });

  describe('session-meta types', () => {
    it('maps queue-operation 1:1 with operation+content payload', () => {
      const raw = parseLine(JSON.stringify({
        type: 'queue-operation',
        operation: 'enqueue',
        sessionId: 's',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'queued prompt body',
      }));
      const out = normalize(raw);
      expect(out).toHaveLength(1);
      expect(out[0]?.type).toBe('queue-operation');
      expect((out[0]?.content as { operation: string }).operation).toBe('enqueue');
      expect((out[0]?.content as { body: string }).body).toBe('queued prompt body');
    });

    it('handles queue-operation missing content', () => {
      const raw = parseLine(JSON.stringify({
        type: 'queue-operation',
        operation: 'dequeue',
        sessionId: 's',
        timestamp: '2026-01-01T00:00:00Z',
      }));
      const out = normalize(raw);
      expect((out[0]?.content as { body: string }).body).toBe('');
    });

    it('handles queue-operation missing timestamp (defaults to "")', () => {
      const raw = parseLine(JSON.stringify({
        type: 'queue-operation',
        operation: 'dequeue',
        sessionId: 's',
      }));
      const out = normalize(raw);
      expect(out[0]?.timestamp).toBe('');
    });

    it('handles attachment missing timestamp / parentUuid / isSidechain (all defaults)', () => {
      const raw = parseLine(JSON.stringify({
        type: 'attachment',
        uuid: 'att-bare',
        sessionId: 's',
        attachment: { type: 'minimal' },
      }));
      const out = normalize(raw);
      expect(out[0]?.timestamp).toBe('');
      expect(out[0]?.subagent_id).toBeUndefined();
    });

    it('maps last-prompt 1:1', () => {
      const raw = parseLine(JSON.stringify({
        type: 'last-prompt',
        lastPrompt: 'the last prompt text',
        sessionId: 's',
      }));
      const out = normalize(raw);
      expect(out).toHaveLength(1);
      expect(out[0]?.type).toBe('last-prompt');
      expect(out[0]?.content).toBe('the last prompt text');
    });

    it('maps custom-title 1:1', () => {
      const raw = parseLine(JSON.stringify({
        type: 'custom-title',
        customTitle: 'My Session Title',
        sessionId: 's',
      }));
      const out = normalize(raw);
      expect(out).toHaveLength(1);
      expect(out[0]?.type).toBe('custom-title');
      expect(out[0]?.content).toBe('My Session Title');
    });

    it('maps attachment 1:1, routing sidechain via parentUuid', () => {
      const raw = parseLine(JSON.stringify({
        type: 'attachment',
        uuid: 'att-1',
        sessionId: 's',
        attachment: { type: 'deferred_tools_delta', addedNames: ['X'] },
        parentUuid: 'p-att',
        isSidechain: true,
        timestamp: '2026-01-01T00:00:00Z',
      }));
      const out = normalize(raw);
      expect(out).toHaveLength(1);
      expect(out[0]?.type).toBe('attachment');
      expect(out[0]?.subagent_id).toBe('p-att');
    });
  });

  describe.runIf(fixturesPresent)('against real exports', () => {
    it('every accepted raw event produces at least one DisplayEvent', () => {
      const lines = loadRealExportJsonlLines('export-small-1776882591631');
      let totalRaw = 0;
      let totalDisplay = 0;
      for (const line of lines) {
        const r = RawEventSchema.safeParse(JSON.parse(line));
        if (!r.success) continue;
        totalRaw++;
        totalDisplay += normalize(r.data).length;
      }
      expect(totalRaw).toBeGreaterThan(0);
      expect(totalDisplay).toBeGreaterThanOrEqual(totalRaw);
    });

    it('produces displayable content (not "unavailable") for the small export', () => {
      const lines = loadRealExportJsonlLines('export-small-1776882591631');
      let displayable = 0;
      for (const line of lines) {
        const r = RawEventSchema.safeParse(JSON.parse(line));
        if (!r.success) continue;
        for (const ev of normalize(r.data)) {
          if (ev.content !== '' && ev.content !== null && ev.content !== undefined) {
            displayable++;
          }
        }
      }
      expect(displayable).toBeGreaterThan(50);
    });
  });
});
