import { describe, it, expect } from 'vitest';
import { MetadataSchema } from './metadata';
import {
  loadRealExportMetadata,
  realExportFixturesPresent,
} from '../__fixtures__/loadRealExport';

const fixturesPresent = realExportFixturesPresent();

describe('MetadataSchema — empirical Claude Desktop shape', () => {
  const fixtures = [
    'export-small-1776882591631',
    'export-mid-1777064512813',
    'export-large-1777095820500',
  ] as const;

  for (const name of fixtures) {
    it.runIf(fixturesPresent)(`accepts the metadata.json from ${name}`, () => {
      const obj = loadRealExportMetadata(name);
      const r = MetadataSchema.safeParse(obj);
      if (!r.success) throw new Error(r.error.message);
      expect(r.data.sessionId.length).toBeGreaterThan(0);
      expect(r.data.cliSessionId.length).toBeGreaterThan(0);
      expect(typeof r.data.createdAt).toBe('number');
      expect(typeof r.data.lastActivityAt).toBe('number');
      expect(r.data.title.length).toBeGreaterThan(0);
    });
  }

  describe('required fields', () => {
    it('rejects missing sessionId', () => {
      const r = MetadataSchema.safeParse({
        cliSessionId: 'cli',
        cwd: '/x',
        model: 'm',
        createdAt: 1,
        lastActivityAt: 2,
        title: 't',
      });
      expect(r.success).toBe(false);
    });

    it('rejects empty sessionId', () => {
      const r = MetadataSchema.safeParse({
        sessionId: '',
        cliSessionId: 'cli',
        cwd: '/x',
        model: 'm',
        createdAt: 1,
        lastActivityAt: 2,
        title: 't',
      });
      expect(r.success).toBe(false);
    });

    it('rejects empty model', () => {
      const r = MetadataSchema.safeParse({
        sessionId: 's',
        cliSessionId: 'cli',
        cwd: '/x',
        model: '',
        createdAt: 1,
        lastActivityAt: 2,
        title: 't',
      });
      expect(r.success).toBe(false);
    });
  });

  describe('numeric type discipline', () => {
    it('rejects createdAt as ISO string (real exports use epoch ms numbers)', () => {
      const r = MetadataSchema.safeParse({
        sessionId: 's',
        cliSessionId: 'cli',
        cwd: '/x',
        model: 'm',
        createdAt: '2026-04-25T00:00:00Z',
        lastActivityAt: 2,
        title: 't',
      });
      expect(r.success).toBe(false);
    });

    it('rejects negative createdAt', () => {
      const r = MetadataSchema.safeParse({
        sessionId: 's',
        cliSessionId: 'cli',
        cwd: '/x',
        model: 'm',
        createdAt: -1,
        lastActivityAt: 2,
        title: 't',
      });
      expect(r.success).toBe(false);
    });

    it('accepts zero timestamps', () => {
      const r = MetadataSchema.safeParse({
        sessionId: 's',
        cliSessionId: 'cli',
        cwd: '/x',
        model: 'm',
        createdAt: 0,
        lastActivityAt: 0,
        title: 't',
      });
      expect(r.success).toBe(true);
    });
  });

  describe('forward-compat passthrough', () => {
    it('preserves unknown fields', () => {
      const r = MetadataSchema.safeParse({
        sessionId: 's',
        cliSessionId: 'cli',
        cwd: '/x',
        model: 'm',
        createdAt: 1,
        lastActivityAt: 2,
        title: 't',
        someNewField: 'preserved',
      });
      expect(r.success).toBe(true);
    });
  });

  describe('optional fields', () => {
    it('accepts metadata with no optional fields', () => {
      const r = MetadataSchema.safeParse({
        sessionId: 's',
        cliSessionId: 'cli',
        cwd: '/x',
        model: 'm',
        createdAt: 1,
        lastActivityAt: 2,
        title: 't',
      });
      expect(r.success).toBe(true);
    });

    it('accepts isArchived boolean', () => {
      const r = MetadataSchema.safeParse({
        sessionId: 's',
        cliSessionId: 'cli',
        cwd: '/x',
        model: 'm',
        createdAt: 1,
        lastActivityAt: 2,
        title: 't',
        isArchived: false,
      });
      expect(r.success).toBe(true);
    });
  });
});
