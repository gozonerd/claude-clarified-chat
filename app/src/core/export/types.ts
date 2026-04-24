export type Format = 'pdf' | 'docx' | 'xlsx' | 'md';
export type ExportArtifacts = {
  readonly pdf: Uint8Array;
  readonly docx: Uint8Array;
  readonly xlsx: Uint8Array;
  readonly md: string;
};
export class SecretAckRequiredError extends Error {
  constructor(public readonly detectionCount: number) {
    super(`Export blocked: ${String(detectionCount)} secret pattern(s) detected; user acknowledgment required`);
    this.name = 'SecretAckRequiredError';
  }
}
