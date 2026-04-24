export type FileMap = ReadonlyMap<string, Uint8Array>;

export type IngestErrorKind =
  | 'zip-slip'
  | 'zip-bomb'
  | 'not-a-zip'
  | 'missing-required'
  | 'io';

export class IngestError extends Error {
  constructor(
    public readonly kind: IngestErrorKind,
    message: string,
  ) {
    super(message);
    this.name = 'IngestError';
  }
}

export type IngestResult =
  | { ok: true; files: FileMap }
  | { ok: false; error: IngestError };

export type IngestOptions = {
  maxFileBytes?: number;
  maxTotalBytes?: number;
};
