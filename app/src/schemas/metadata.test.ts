import { describe, it, expect } from 'vitest';
import { MetadataSchema } from './metadata';

describe('MetadataSchema', () => {
  it('parses valid metadata', () => {
    const data = {
      session_id: 'sess-1',
      cli_session_id: 'cli-sess-1',
      cwd: '/home/user',
      model: 'claude-opus',
      created_at: '2026-04-22T12:00:00Z',
      last_activity_at: '2026-04-22T13:00:00Z',
      title: 'Test Session',
    };
    const result = MetadataSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.session_id).toBe('sess-1');
      expect(result.data.model).toBe('claude-opus');
    }
  });

  it('parses metadata with total_input_tokens', () => {
    const data = {
      session_id: 'sess-2',
      cli_session_id: 'cli-sess-2',
      cwd: '/home/user',
      model: 'claude-opus',
      created_at: '2026-04-22T12:00:00Z',
      last_activity_at: '2026-04-22T13:00:00Z',
      title: 'Test Session',
      total_input_tokens: 1000,
    };
    const result = MetadataSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.total_input_tokens).toBe(1000);
    }
  });

  it('parses metadata with total_output_tokens', () => {
    const data = {
      session_id: 'sess-3',
      cli_session_id: 'cli-sess-3',
      cwd: '/home/user',
      model: 'claude-opus',
      created_at: '2026-04-22T12:00:00Z',
      last_activity_at: '2026-04-22T13:00:00Z',
      title: 'Test Session',
      total_output_tokens: 500,
    };
    const result = MetadataSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.total_output_tokens).toBe(500);
    }
  });

  it('parses metadata with both token fields', () => {
    const data = {
      session_id: 'sess-4',
      cli_session_id: 'cli-sess-4',
      cwd: '/home/user',
      model: 'claude-opus',
      created_at: '2026-04-22T12:00:00Z',
      last_activity_at: '2026-04-22T13:00:00Z',
      title: 'Test Session',
      total_input_tokens: 1500,
      total_output_tokens: 750,
    };
    const result = MetadataSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.total_input_tokens).toBe(1500);
      expect(result.data.total_output_tokens).toBe(750);
    }
  });

  it('handles optional tokens when absent', () => {
    const data = {
      session_id: 'sess-5',
      cli_session_id: 'cli-sess-5',
      cwd: '/home/user',
      model: 'claude-opus',
      created_at: '2026-04-22T12:00:00Z',
      last_activity_at: '2026-04-22T13:00:00Z',
      title: 'Test Session',
    };
    const result = MetadataSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.total_input_tokens).toBeUndefined();
      expect(result.data.total_output_tokens).toBeUndefined();
    }
  });

  it('rejects missing session_id', () => {
    const data = {
      cli_session_id: 'cli-sess-6',
      cwd: '/home/user',
      model: 'claude-opus',
      created_at: '2026-04-22T12:00:00Z',
      last_activity_at: '2026-04-22T13:00:00Z',
      title: 'Test Session',
    };
    const result = MetadataSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('rejects empty session_id', () => {
    const data = {
      session_id: '',
      cli_session_id: 'cli-sess-7',
      cwd: '/home/user',
      model: 'claude-opus',
      created_at: '2026-04-22T12:00:00Z',
      last_activity_at: '2026-04-22T13:00:00Z',
      title: 'Test Session',
    };
    const result = MetadataSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('rejects empty model', () => {
    const data = {
      session_id: 'sess-8',
      cli_session_id: 'cli-sess-8',
      cwd: '/home/user',
      model: '',
      created_at: '2026-04-22T12:00:00Z',
      last_activity_at: '2026-04-22T13:00:00Z',
      title: 'Test Session',
    };
    const result = MetadataSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('rejects invalid created_at datetime', () => {
    const data = {
      session_id: 'sess-9',
      cli_session_id: 'cli-sess-9',
      cwd: '/home/user',
      model: 'claude-opus',
      created_at: 'not-a-date',
      last_activity_at: '2026-04-22T13:00:00Z',
      title: 'Test Session',
    };
    const result = MetadataSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('rejects negative total_input_tokens', () => {
    const data = {
      session_id: 'sess-10',
      cli_session_id: 'cli-sess-10',
      cwd: '/home/user',
      model: 'claude-opus',
      created_at: '2026-04-22T12:00:00Z',
      last_activity_at: '2026-04-22T13:00:00Z',
      title: 'Test Session',
      total_input_tokens: -100,
    };
    const result = MetadataSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('accepts zero token values', () => {
    const data = {
      session_id: 'sess-11',
      cli_session_id: 'cli-sess-11',
      cwd: '/home/user',
      model: 'claude-opus',
      created_at: '2026-04-22T12:00:00Z',
      last_activity_at: '2026-04-22T13:00:00Z',
      title: 'Test Session',
      total_input_tokens: 0,
      total_output_tokens: 0,
    };
    const result = MetadataSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});
