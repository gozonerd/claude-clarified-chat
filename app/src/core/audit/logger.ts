import type { AuditEvent, AuditEventKind, AuditSink } from './types';

export class InMemoryAuditSink implements AuditSink {
  private readonly entries: AuditEvent[] = [];
  write(entry: AuditEvent): void { this.entries.push(entry); }
  snapshot(): ReadonlyArray<AuditEvent> { return [...this.entries]; }
  clear(): void { this.entries.length = 0; }
}

export class AuditLogger {
  constructor(private readonly sink: AuditSink, private readonly clock: () => Date = (): Date => new Date()) {}
  log(kind: AuditEventKind, payload: Readonly<Record<string, unknown>> = {}): void {
    this.sink.write({ kind, timestamp: this.clock().toISOString(), payload });
  }
}
