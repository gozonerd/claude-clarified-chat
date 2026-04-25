export type AuditEventKind = 'ingest_start' | 'ingest_complete' | 'parse_error' | 'export_start' | 'export_complete' | 'secret_detection';
export type AuditEvent = { readonly kind: AuditEventKind; readonly timestamp: string; readonly payload: Readonly<Record<string, unknown>> };
export interface AuditSink { write(entry: AuditEvent): void }
