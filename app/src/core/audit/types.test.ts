import { describe, it, expect } from 'vitest';
import type { AuditEvent } from './types';

describe('audit types', () => {
  it('smoke test: AuditEvent type is correctly shaped', () => {
    const event: AuditEvent = {
      kind: 'ingest_start',
      timestamp: '2026-04-24T12:00:00.000Z',
      payload: { count: 42 },
    };
    expect(event.kind).toBe('ingest_start');
    expect(event.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(event.payload.count).toBe(42);
  });
});
