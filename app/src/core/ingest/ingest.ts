import { unzipSync, strFromU8 } from 'fflate';
import type { IngestOptions, IngestResult } from './types';
import { IngestError } from './types';

const DEFAULT_FILE_CAP = 100 * 1024 * 1024;
const DEFAULT_TOTAL_CAP = 500 * 1024 * 1024;

export function ingest(
  zipBytes: Uint8Array,
  opts: IngestOptions = {},
): IngestResult {
  const fileCap = opts.maxFileBytes ?? DEFAULT_FILE_CAP;
  const totalCap = opts.maxTotalBytes ?? DEFAULT_TOTAL_CAP;

  let entries: Record<string, Uint8Array>;
  try {
    entries = unzipSync(zipBytes);
  } catch (e) {
    return {
      ok: false,
      error: new IngestError(
        'not-a-zip',
        `failed to parse zip: ${(e as Error).message}`,
      ),
    };
  }

  const files = new Map<string, Uint8Array>();
  let total = 0;

  for (const [path, data] of Object.entries(entries)) {
    if (path === '' || path.startsWith('/') || path.startsWith('\\')) {
      return {
        ok: false,
        error: new IngestError('zip-slip', `absolute path rejected: ${path}`),
      };
    }

    const segments = path.split(/[/\\]/);
    if (segments.some((s) => s === '..')) {
      return {
        ok: false,
        error: new IngestError(
          'zip-slip',
          `traversal segment rejected: ${path}`,
        ),
      };
    }

    if (data.byteLength > fileCap) {
      return {
        ok: false,
        error: new IngestError(
          'zip-bomb',
          `per-file cap exceeded on ${path}: ${String(data.byteLength)} > ${String(fileCap)}`,
        ),
      };
    }

    total += data.byteLength;
    if (total > totalCap) {
      return {
        ok: false,
        error: new IngestError(
          'zip-bomb',
          `total cap exceeded: ${String(total)} > ${String(totalCap)}`,
        ),
      };
    }

    files.set(path, data);
  }

  return { ok: true, files };
}

export { strFromU8 };
