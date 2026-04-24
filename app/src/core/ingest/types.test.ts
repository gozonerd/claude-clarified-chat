import { describe, it, expect } from 'vitest';
import { IngestError, type IngestErrorKind } from './types';

describe('IngestError', () => {
  it('instantiates with zip-slip kind', () => {
    const error = new IngestError('zip-slip', 'test message');
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('IngestError');
    expect(error.kind).toBe('zip-slip');
    expect(error.message).toBe('test message');
  });

  it('instantiates with zip-bomb kind', () => {
    const error = new IngestError('zip-bomb', 'bomb detected');
    expect(error.kind).toBe('zip-bomb');
    expect(error.message).toBe('bomb detected');
  });

  it('instantiates with not-a-zip kind', () => {
    const error = new IngestError('not-a-zip', 'invalid format');
    expect(error.kind).toBe('not-a-zip');
    expect(error.message).toBe('invalid format');
  });

  it('instantiates with missing-required kind', () => {
    const error = new IngestError('missing-required', 'file missing');
    expect(error.kind).toBe('missing-required');
    expect(error.message).toBe('file missing');
  });

  it('instantiates with io kind', () => {
    const error = new IngestError('io', 'io failed');
    expect(error.kind).toBe('io');
    expect(error.message).toBe('io failed');
  });

  it('preserves message and kind', () => {
    const msg = 'custom error message';
    const kind: IngestErrorKind = 'zip-slip';
    const error = new IngestError(kind, msg);

    expect(error.message).toBe(msg);
    expect(error.kind).toBe(kind);
  });

  it('can be thrown and caught', () => {
    const error = new IngestError('not-a-zip', 'test');
    expect(() => {
      throw error;
    }).toThrow('test');
  });

  it('maintains instanceof check', () => {
    const error = new IngestError('zip-slip', 'test');
    expect(error instanceof IngestError).toBe(true);
    expect(error instanceof Error).toBe(true);
  });
});
