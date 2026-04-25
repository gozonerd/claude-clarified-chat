import fs from 'node:fs';
import path from 'node:path';
import type { FileMap } from '../core/ingest/types';

const REAL_EXPORTS_DIR = path.join(__dirname, 'real-exports');

export type RealExportName =
  | 'export-small-1776882591631'
  | 'export-mid-1777064512813'
  | 'export-large-1777095820500';

// Real Claude Desktop export fixtures are gitignored — they contain real session
// content and are the canonical anchor for F13 (fixture-tautological validation)
// prevention. Drop your own .zip exports into the real-exports/ directory using
// the names declared in RealExportName to run the F13 acceptance tests locally.
// In environments where the fixtures are absent (public CI), these tests skip.
const REQUIRED_FIXTURES: ReadonlyArray<RealExportName> = [
  'export-small-1776882591631',
  'export-mid-1777064512813',
  'export-large-1777095820500',
];

export function realExportFixturesPresent(rootDir: string = REAL_EXPORTS_DIR): boolean {
  if (!fs.existsSync(rootDir)) return false;
  for (const name of REQUIRED_FIXTURES) {
    const dir = path.join(rootDir, `${name}-extracted`);
    if (!fs.existsSync(dir)) return false;
    const hasJsonl = fs.readdirSync(dir).some((f) => f.endsWith('.jsonl'));
    if (!hasJsonl) return false;
  }
  return true;
}

// Build a FileMap from a real Claude Desktop export's extracted directory.
// Used by tests that need to validate against empirical export shape rather
// than synthesized fixtures (the F13 prevention discipline).
export function loadRealExportFileMap(name: RealExportName): FileMap {
  const root = path.join(REAL_EXPORTS_DIR, `${name}-extracted`);
  const map = new Map<string, Uint8Array>();
  walk(root, root, map);
  return map;
}

function walk(rootDir: string, current: string, map: Map<string, Uint8Array>): void {
  const entries = fs.readdirSync(current, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(current, entry.name);
    if (entry.isDirectory()) {
      walk(rootDir, full, map);
    } else {
      const rel = path.relative(rootDir, full).split(path.sep).join('/');
      map.set(rel, fs.readFileSync(full));
    }
  }
}

export function loadRealExportJsonlLines(name: RealExportName): string[] {
  const root = path.join(REAL_EXPORTS_DIR, `${name}-extracted`);
  const files = fs.readdirSync(root);
  const jsonl = files.find((f) => f.endsWith('.jsonl'));
  if (jsonl === undefined) {
    throw new Error(`no .jsonl file found in ${root}`);
  }
  const text = fs.readFileSync(path.join(root, jsonl), 'utf8');
  return text.split('\n').filter((l) => l.trim() !== '');
}

export function loadRealExportMetadata(name: RealExportName): unknown {
  const root = path.join(REAL_EXPORTS_DIR, `${name}-extracted`);
  const text = fs.readFileSync(path.join(root, 'metadata.json'), 'utf8');
  return JSON.parse(text) as unknown;
}
