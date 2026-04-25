import { describe, it, expect } from 'vitest';
import { AuditLogger, InMemoryAuditSink } from './logger';

describe('InMemoryAuditSink', () => {
  it('writes entries in order', () => {
    const sink = new InMemoryAuditSink();
    sink.write({ kind: 'ingest_start', timestamp: '2026-04-24T00:00:00Z', payload: {} });
    sink.write({ kind: 'ingest_complete', timestamp: '2026-04-24T00:01:00Z', payload: {} });
    const snapshot = sink.snapshot();
    expect(snapshot).toHaveLength(2);
    expect(snapshot[0]?.kind).toBe('ingest_start');
    expect(snapshot[1]?.kind).toBe('ingest_complete');
  });

  it('snapshot returns immutable copy: modifying snapshot does not affect future snapshots', () => {
    const sink = new InMemoryAuditSink();
    sink.write({ kind: 'ingest_start', timestamp: '2026-04-24T00:00:00Z', payload: {} });
    const snapshot1 = sink.snapshot();
    expect(snapshot1).toHaveLength(1);
    const snapshot2 = sink.snapshot();
    expect(snapshot1).not.toBe(snapshot2);
    expect(snapshot2).toHaveLength(1);
  });

  it('clear empties the sink', () => {
    const sink = new InMemoryAuditSink();
    sink.write({ kind: 'ingest_start', timestamp: '2026-04-24T00:00:00Z', payload: {} });
    expect(sink.snapshot()).toHaveLength(1);
    sink.clear();
    expect(sink.snapshot()).toHaveLength(0);
  });
});

describe('AuditLogger', () => {
  it('logs with default clock: timestamp is a valid ISO string', () => {
    const sink = new InMemoryAuditSink();
    const logger = new AuditLogger(sink);
    logger.log('ingest_start');
    const snapshot = sink.snapshot();
    expect(snapshot).toHaveLength(1);
    const entry = snapshot[0];
    expect(entry).toBeDefined();
    if (entry) {
      const { timestamp } = entry;
      expect(typeof timestamp).toBe('string');
      const date = new Date(timestamp);
      expect(date.toISOString()).toBe(timestamp);
    }
  });

  it('logs with injected clock', () => {
    const sink = new InMemoryAuditSink();
    const fixedDate = new Date('2026-04-24T12:34:56Z');
    const logger = new AuditLogger(sink, () => fixedDate);
    logger.log('export_start');
    const snapshot = sink.snapshot();
    expect(snapshot[0]?.timestamp).toBe('2026-04-24T12:34:56.000Z');
  });

  it('logs with default-empty-payload when no payload arg', () => {
    const sink = new InMemoryAuditSink();
    const logger = new AuditLogger(sink);
    logger.log('ingest_start');
    const snapshot = sink.snapshot();
    expect(snapshot[0]?.payload).toEqual({});
  });

  it('logs with explicit payload preserved exactly', () => {
    const sink = new InMemoryAuditSink();
    const logger = new AuditLogger(sink);
    const payload = { files: 5, errors: 0 };
    logger.log('ingest_complete', payload);
    const snapshot = sink.snapshot();
    expect(snapshot[0]?.payload).toEqual(payload);
  });
});
