import { describe, it, expect } from 'vitest';
import { EventSchema } from './event';

describe('EventSchema', () => {
  it('parses user event variant', () => {
    const data = {
      id: 'event-1',
      type: 'user' as const,
      timestamp: '2026-04-22T12:00:00Z',
      content: 'hello',
    };
    const result = EventSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe('user');
      expect(result.data.id).toBe('event-1');
    }
  });

  it('parses assistant event variant', () => {
    const data = {
      id: 'event-2',
      type: 'assistant' as const,
      timestamp: '2026-04-22T12:00:00Z',
      content: 'response',
    };
    const result = EventSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe('assistant');
    }
  });

  it('parses tool_use event variant', () => {
    const data = {
      id: 'event-3',
      type: 'tool_use' as const,
      timestamp: '2026-04-22T12:00:00Z',
      content: { tool: 'test' },
    };
    const result = EventSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe('tool_use');
    }
  });

  it('parses tool_result event variant', () => {
    const data = {
      id: 'event-4',
      type: 'tool_result' as const,
      timestamp: '2026-04-22T12:00:00Z',
      content: 'result',
    };
    const result = EventSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe('tool_result');
    }
  });

  it('parses thinking event variant', () => {
    const data = {
      id: 'event-5',
      type: 'thinking' as const,
      timestamp: '2026-04-22T12:00:00Z',
      content: 'reasoning',
    };
    const result = EventSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe('thinking');
    }
  });

  it('parses system event variant', () => {
    const data = {
      id: 'event-6',
      type: 'system' as const,
      timestamp: '2026-04-22T12:00:00Z',
      content: 'system info',
    };
    const result = EventSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe('system');
    }
  });

  it('includes optional tokens when present', () => {
    const data = {
      id: 'event-7',
      type: 'user' as const,
      timestamp: '2026-04-22T12:00:00Z',
      content: 'test',
      tokens: { input: 100, output: 50 },
    };
    const result = EventSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tokens).toEqual({ input: 100, output: 50 });
    }
  });

  it('handles optional tokens when absent', () => {
    const data = {
      id: 'event-8',
      type: 'user' as const,
      timestamp: '2026-04-22T12:00:00Z',
      content: 'test',
    };
    const result = EventSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tokens).toBeUndefined();
    }
  });

  it('includes optional subagent_id when present', () => {
    const data = {
      id: 'event-9',
      type: 'assistant' as const,
      timestamp: '2026-04-22T12:00:00Z',
      content: 'test',
      subagent_id: 'agent-1',
    };
    const result = EventSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.subagent_id).toBe('agent-1');
    }
  });

  it('handles optional subagent_id when absent', () => {
    const data = {
      id: 'event-10',
      type: 'assistant' as const,
      timestamp: '2026-04-22T12:00:00Z',
      content: 'test',
    };
    const result = EventSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.subagent_id).toBeUndefined();
    }
  });

  it('rejects event with missing id', () => {
    const data = {
      type: 'user' as const,
      timestamp: '2026-04-22T12:00:00Z',
      content: 'test',
    };
    const result = EventSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('rejects event with empty id', () => {
    const data = {
      id: '',
      type: 'user' as const,
      timestamp: '2026-04-22T12:00:00Z',
      content: 'test',
    };
    const result = EventSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('rejects event with invalid timestamp', () => {
    const data = {
      id: 'event-11',
      type: 'user' as const,
      timestamp: 'not-a-date',
      content: 'test',
    };
    const result = EventSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('rejects event with invalid type', () => {
    const data = {
      id: 'event-12',
      type: 'invalid',
      timestamp: '2026-04-22T12:00:00Z',
      content: 'test',
    };
    const result = EventSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('rejects negative token input', () => {
    const data = {
      id: 'event-13',
      type: 'user' as const,
      timestamp: '2026-04-22T12:00:00Z',
      content: 'test',
      tokens: { input: -1, output: 10 },
    };
    const result = EventSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('accepts zero token values', () => {
    const data = {
      id: 'event-14',
      type: 'user' as const,
      timestamp: '2026-04-22T12:00:00Z',
      content: 'test',
      tokens: { input: 0, output: 0 },
    };
    const result = EventSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tokens).toEqual({ input: 0, output: 0 });
    }
  });
});
