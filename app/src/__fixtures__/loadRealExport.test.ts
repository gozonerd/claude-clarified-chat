import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  loadRealExportJsonlLines,
  realExportFixturesPresent,
  type RealExportName,
} from './loadRealExport';

const fixturesPresent = realExportFixturesPresent();

describe('realExportFixturesPresent', () => {
  it('returns false when the root directory does not exist', () => {
    const stubRoot = path.join(__dirname, 'real-exports', '__nonexistent_root__');
    expect(realExportFixturesPresent(stubRoot)).toBe(false);
  });

  it('returns false when a required extracted directory is missing', () => {
    const tmpRoot = path.join(__dirname, 'real-exports', '__test_tmp_missing_dir__');
    fs.mkdirSync(tmpRoot, { recursive: true });
    try {
      // Empty root — none of the required fixture extracted dirs exist
      expect(realExportFixturesPresent(tmpRoot)).toBe(false);
    } finally {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    }
  });

  it('returns false when the extracted dir exists but has no .jsonl', () => {
    const tmpRoot = path.join(__dirname, 'real-exports', '__test_tmp_no_jsonl__');
    fs.mkdirSync(tmpRoot, { recursive: true });
    try {
      // Create all 3 required extracted dirs but with no .jsonl in the first one
      for (const name of [
        'export-small-1776882591631',
        'export-mid-1777064512813',
        'export-large-1777095820500',
      ]) {
        fs.mkdirSync(path.join(tmpRoot, `${name}-extracted`), { recursive: true });
      }
      expect(realExportFixturesPresent(tmpRoot)).toBe(false);
    } finally {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    }
  });
});

describe('loadRealExportJsonlLines', () => {
  it('throws a descriptive error when the directory has no .jsonl file', () => {
    // Create a sibling fixture dir matching the convention but without a .jsonl
    const stubName = 'export-stub-empty';
    const stubDir = path.join(__dirname, 'real-exports', `${stubName}-extracted`);
    fs.mkdirSync(stubDir, { recursive: true });
    fs.writeFileSync(path.join(stubDir, 'metadata.json'), '{}');
    try {
      expect(() => {
        loadRealExportJsonlLines(stubName as unknown as RealExportName);
      }).toThrow(/no \.jsonl/);
    } finally {
      fs.rmSync(stubDir, { recursive: true, force: true });
    }
  });

  it.runIf(fixturesPresent)('round-trips: every line in the loaded file is non-empty', () => {
    const lines = loadRealExportJsonlLines('export-small-1776882591631');
    expect(lines.length).toBeGreaterThan(0);
    for (const ln of lines) expect(ln.trim().length).toBeGreaterThan(0);
  });
});
