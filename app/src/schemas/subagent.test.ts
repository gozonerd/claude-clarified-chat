import { describe, it, expect } from 'vitest';
import { SubAgentMetaSchema } from './subagent';

describe('SubAgentMetaSchema', () => {
  it('parses valid subagent metadata', () => {
    const data = {
      id: 'agent-1',
      spawned_at: '2026-04-22T12:00:00Z',
      parent_id: 'parent-1',
    };
    const result = SubAgentMetaSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe('agent-1');
      expect(result.data.parent_id).toBe('parent-1');
    }
  });

  it('parses subagent with purpose', () => {
    const data = {
      id: 'agent-2',
      spawned_at: '2026-04-22T12:00:00Z',
      parent_id: 'parent-2',
      purpose: 'data processing',
    };
    const result = SubAgentMetaSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.purpose).toBe('data processing');
    }
  });

  it('handles optional purpose when absent', () => {
    const data = {
      id: 'agent-3',
      spawned_at: '2026-04-22T12:00:00Z',
      parent_id: 'parent-3',
    };
    const result = SubAgentMetaSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.purpose).toBeUndefined();
    }
  });

  it('rejects missing id', () => {
    const data = {
      spawned_at: '2026-04-22T12:00:00Z',
      parent_id: 'parent-4',
    };
    const result = SubAgentMetaSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('rejects empty id', () => {
    const data = {
      id: '',
      spawned_at: '2026-04-22T12:00:00Z',
      parent_id: 'parent-5',
    };
    const result = SubAgentMetaSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('rejects invalid spawned_at datetime', () => {
    const data = {
      id: 'agent-4',
      spawned_at: 'not-a-date',
      parent_id: 'parent-6',
    };
    const result = SubAgentMetaSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('rejects missing parent_id', () => {
    const data = {
      id: 'agent-5',
      spawned_at: '2026-04-22T12:00:00Z',
    };
    const result = SubAgentMetaSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('rejects empty parent_id', () => {
    const data = {
      id: 'agent-6',
      spawned_at: '2026-04-22T12:00:00Z',
      parent_id: '',
    };
    const result = SubAgentMetaSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('accepts empty purpose string', () => {
    const data = {
      id: 'agent-7',
      spawned_at: '2026-04-22T12:00:00Z',
      parent_id: 'parent-7',
      purpose: '',
    };
    const result = SubAgentMetaSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.purpose).toBe('');
    }
  });
});
