import { describe, it, expect } from 'vitest';
import { zipSync } from 'fflate';
import * as fc from 'fast-check';
import { ingest } from './ingest';
import { IngestError } from './types';

describe('ingest', () => {
  it('parses valid zip with two files', () => {
    const files: Record<string, Uint8Array> = {
      'file1.txt': new Uint8Array([1, 2, 3]),
      'file2.txt': new Uint8Array([4, 5, 6]),
    };
    const zipBytes = zipSync(files);
    const result = ingest(zipBytes);

    expect(result.ok).toBe(true);
    if (result.ok) {
      // Verify the entries were parsed
      expect(result.files.size).toBeGreaterThanOrEqual(2);
      const keys = Array.from(result.files.keys());
      // Files should be there in some form
      const hasFile1 = keys.some(k => k.includes('file1'));
      const hasFile2 = keys.some(k => k.includes('file2'));
      expect(hasFile1).toBe(true);
      expect(hasFile2).toBe(true);
    }
  });

  it('rejects zip with path traversal (..)', () => {
    const files = {
      'normal.txt': new TextEncoder().encode('content'),
      '../escape.txt': new TextEncoder().encode('escaped'),
    };
    const zipBytes = zipSync(files);
    const result = ingest(zipBytes);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('zip-slip');
      expect(result.error.message).toContain('traversal segment');
    }
  });

  it('rejects zip with absolute path', () => {
    const files = {
      '/absolute/path.txt': new TextEncoder().encode('content'),
    };
    const zipBytes = zipSync(files);
    const result = ingest(zipBytes);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('zip-slip');
      expect(result.error.message).toContain('absolute path');
    }
  });

  it('rejects zip with single file exceeding per-file cap', () => {
    const files = {
      'large.txt': new Uint8Array(20),
    };
    const zipBytes = zipSync(files);
    const result = ingest(zipBytes, { maxFileBytes: 10 });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('zip-bomb');
      expect(result.error.message).toContain('per-file cap exceeded');
    }
  });

  it('rejects zip exceeding total cap', () => {
    const files = {
      'file1.txt': new Uint8Array(300),
      'file2.txt': new Uint8Array(300),
    };
    const zipBytes = zipSync(files);
    const result = ingest(zipBytes, { maxTotalBytes: 500 });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('zip-bomb');
      expect(result.error.message).toContain('total cap exceeded');
    }
  });

  it('rejects non-zip bytes', () => {
    const notZip = new Uint8Array([0x00, 0x01, 0x02, 0x03]);
    const result = ingest(notZip);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('not-a-zip');
      expect(result.error.message).toContain('failed to parse zip');
    }
  });

  it('works with default options (zero-option call)', () => {
    const files: Record<string, Uint8Array> = {
      'test.txt': new Uint8Array([42, 43, 44]),
    };
    const zipBytes = zipSync(files);
    const result = ingest(zipBytes);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.files.size).toBeGreaterThanOrEqual(1);
      const keys = Array.from(result.files.keys());
      // Should have some file entries
      expect(keys.length).toBeGreaterThan(0);
    }
  });

  it('property test: ingest never throws on random bytes', () => {
    fc.assert(
      fc.property(
        fc.uint8Array({ minLength: 0, maxLength: 200 }),
        (bytes) => {
          const result = ingest(bytes);
          return typeof result.ok === 'boolean';
        },
      ),
      { numRuns: 100 },
    );
  });

  it('IngestError has correct kind for zip-slip', () => {
    const error = new IngestError('zip-slip', 'test message');
    expect(error.name).toBe('IngestError');
    expect(error.kind).toBe('zip-slip');
    expect(error.message).toBe('test message');
  });

  it('IngestError has correct kind for zip-bomb', () => {
    const error = new IngestError('zip-bomb', 'bomb message');
    expect(error.name).toBe('IngestError');
    expect(error.kind).toBe('zip-bomb');
    expect(error.message).toBe('bomb message');
  });

  it('IngestError has correct kind for not-a-zip', () => {
    const error = new IngestError('not-a-zip', 'not zip');
    expect(error.name).toBe('IngestError');
    expect(error.kind).toBe('not-a-zip');
    expect(error.message).toBe('not zip');
  });

  it('IngestError has correct kind for missing-required', () => {
    const error = new IngestError('missing-required', 'missing file');
    expect(error.name).toBe('IngestError');
    expect(error.kind).toBe('missing-required');
    expect(error.message).toBe('missing file');
  });

  it('IngestError has correct kind for io', () => {
    const error = new IngestError('io', 'io error');
    expect(error.name).toBe('IngestError');
    expect(error.kind).toBe('io');
    expect(error.message).toBe('io error');
  });

  it('accepts per-file cap exactly at boundary', () => {
    const content = new Uint8Array(100);
    const files = { 'file.bin': content };
    const zipBytes = zipSync(files);
    const result = ingest(zipBytes, { maxFileBytes: 100 });

    expect(result.ok).toBe(true);
  });

  it('accepts total cap exactly at boundary', () => {
    const files = {
      'file1.txt': new Uint8Array(100),
      'file2.txt': new Uint8Array(100),
    };
    const zipBytes = zipSync(files);
    const result = ingest(zipBytes, { maxTotalBytes: 200 });

    expect(result.ok).toBe(true);
  });

  it('rejects backslash-style path traversal', () => {
    const files = {
      'normal.txt': new TextEncoder().encode('content'),
      '..\\escape.txt': new TextEncoder().encode('escaped'),
    };
    const zipBytes = zipSync(files);
    const result = ingest(zipBytes);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('zip-slip');
    }
  });

  it('handles deeply nested paths', () => {
    const files: Record<string, Uint8Array> = {
      'a/b/c/d/e/f/file.txt': new Uint8Array([99]),
    };
    const zipBytes = zipSync(files);
    const result = ingest(zipBytes);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.files.size).toBeGreaterThan(0);
      const keys = Array.from(result.files.keys());
      // Should contain the nested file path
      const hasNestedFile = keys.some(k => k.includes('a') && k.includes('file'));
      expect(hasNestedFile).toBe(true);
    }
  });

  it('rejects empty path name', () => {
    const files = {
      '': new TextEncoder().encode('empty path'),
    };
    const zipBytes = zipSync(files);
    const result = ingest(zipBytes);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('zip-slip');
    }
  });
});
