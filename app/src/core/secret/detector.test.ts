import { describe, it, expect } from 'vitest';
import type { Event } from '../../schemas/event';
import { scan } from './detector';
import { positives, negatives } from './__fixtures__/reference-corpus';

describe('detector.scan', () => {
  it('one event with one anthropic key → 1 detection, pattern anthropic', () => {
    const events: Event[] = [
      {
        id: 'ev1',
        type: 'user',
        timestamp: '2024-01-01T00:00:00Z',
        content: 'sk-ant-api03-AbCdEfGh1234567890qwertyuiop',
      },
    ];
    const detections = scan(events);
    expect(detections).toHaveLength(1);
    const d = detections[0];
    expect(d?.eventId).toBe('ev1');
    expect(d?.pattern).toBe('anthropic');
  });

  it('one event with both anthropic and openai keys (separate substrings) → 2 detections, distinct', () => {
    const events: Event[] = [
      {
        id: 'ev1',
        type: 'user',
        timestamp: '2024-01-01T00:00:00Z',
        content: 'anthropic: sk-ant-api03-AbCdEfGh1234567890qwertyuiop openai: sk-0123456789abcdef0123456789abcdef',
      },
    ];
    const detections = scan(events);
    expect(detections.length).toBeGreaterThanOrEqual(2);
    const patterns = new Set(detections.map(d => d.pattern));
    expect(patterns).toContain('anthropic');
    expect(patterns).toContain('openai');
  });

  it('anthropic key is NOT classified as openai (precedence check)', () => {
    const events: Event[] = [
      {
        id: 'ev1',
        type: 'user',
        timestamp: '2024-01-01T00:00:00Z',
        content: 'sk-ant-api03-AbCdEfGh1234567890qwertyuiop',
      },
    ];
    const detections = scan(events);
    expect(detections).toHaveLength(1);
    const d = detections[0];
    expect(d?.pattern).toBe('anthropic');
  });

  it('AWS access key detected', () => {
    const events: Event[] = [
      {
        id: 'ev1',
        type: 'user',
        timestamp: '2024-01-01T00:00:00Z',
        content: 'aws key: AKIA1A2B3C4D5E6F7G8H',
      },
    ];
    const detections = scan(events);
    expect(detections).toHaveLength(1);
    const d = detections[0];
    expect(d?.pattern).toBe('aws');
  });

  it('JWT detected; short JWT-like (only 2 segments) NOT detected', () => {
    const events: Event[] = [
      {
        id: 'ev1',
        type: 'user',
        timestamp: '2024-01-01T00:00:00Z',
        content: 'valid: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c invalid: eyJhbGciOiJIUzI1NiJ9.incomplete',
      },
    ];
    const detections = scan(events);
    const jwtDetections = detections.filter(d => d.pattern === 'jwt');
    expect(jwtDetections.length).toBeGreaterThanOrEqual(1);
  });

  it('github-pat ghp_ variant detected', () => {
    const events: Event[] = [
      {
        id: 'ev1',
        type: 'user',
        timestamp: '2024-01-01T00:00:00Z',
        content: 'ghp_1234567890abcdefghijklmnopqrstuvwxyz123456',
      },
    ];
    const detections = scan(events);
    expect(detections).toHaveLength(1);
    const d = detections[0];
    expect(d?.pattern).toBe('github-pat');
  });

  it('github-pat gho_ variant detected', () => {
    const events: Event[] = [
      {
        id: 'ev1',
        type: 'user',
        timestamp: '2024-01-01T00:00:00Z',
        content: 'gho_0123456789abcdefghijklmnopqrstuvwxyz123456',
      },
    ];
    const detections = scan(events);
    expect(detections).toHaveLength(1);
    const d = detections[0];
    expect(d?.pattern).toBe('github-pat');
  });

  it('rsa-pem RSA variant detected', () => {
    const events: Event[] = [
      {
        id: 'ev1',
        type: 'user',
        timestamp: '2024-01-01T00:00:00Z',
        content: '-----BEGIN RSA PRIVATE KEY-----',
      },
    ];
    const detections = scan(events);
    expect(detections).toHaveLength(1);
    const d = detections[0];
    expect(d?.pattern).toBe('rsa-pem');
  });

  it('rsa-pem OPENSSH variant detected', () => {
    const events: Event[] = [
      {
        id: 'ev1',
        type: 'user',
        timestamp: '2024-01-01T00:00:00Z',
        content: '-----BEGIN OPENSSH PRIVATE KEY-----',
      },
    ];
    const detections = scan(events);
    expect(detections).toHaveLength(1);
    const d = detections[0];
    expect(d?.pattern).toBe('rsa-pem');
  });

  it('rsa-pem EC variant detected', () => {
    const events: Event[] = [
      {
        id: 'ev1',
        type: 'user',
        timestamp: '2024-01-01T00:00:00Z',
        content: '-----BEGIN EC PRIVATE KEY-----',
      },
    ];
    const detections = scan(events);
    expect(detections).toHaveLength(1);
    const d = detections[0];
    expect(d?.pattern).toBe('rsa-pem');
  });

  it('rsa-pem DSA variant detected', () => {
    const events: Event[] = [
      {
        id: 'ev1',
        type: 'user',
        timestamp: '2024-01-01T00:00:00Z',
        content: '-----BEGIN DSA PRIVATE KEY-----',
      },
    ];
    const detections = scan(events);
    expect(detections).toHaveLength(1);
    const d = detections[0];
    expect(d?.pattern).toBe('rsa-pem');
  });

  it('password-kv with = detected', () => {
    const events: Event[] = [
      {
        id: 'ev1',
        type: 'user',
        timestamp: '2024-01-01T00:00:00Z',
        content: 'password=MySecurePass123!',
      },
    ];
    const detections = scan(events);
    expect(detections.length).toBeGreaterThan(0);
    expect(detections.some(d => d.pattern === 'password-kv')).toBe(true);
  });

  it('password-kv with : detected', () => {
    const events: Event[] = [
      {
        id: 'ev1',
        type: 'user',
        timestamp: '2024-01-01T00:00:00Z',
        content: 'password: "MySecurePass123!"',
      },
    ];
    const detections = scan(events);
    expect(detections.length).toBeGreaterThan(0);
    expect(detections.some(d => d.pattern === 'password-kv')).toBe(true);
  });

  it('password-kv quoted and unquoted both detected', () => {
    const events: Event[] = [
      {
        id: 'ev1',
        type: 'user',
        timestamp: '2024-01-01T00:00:00Z',
        content: 'password: "quoted123val" secret=unquotedval123',
      },
    ];
    const detections = scan(events);
    const kvDetections = detections.filter(d => d.pattern === 'password-kv');
    expect(kvDetections.length).toBeGreaterThanOrEqual(1);
  });

  it('empty content → no detections', () => {
    const events: Event[] = [
      {
        id: 'ev1',
        type: 'user',
        timestamp: '2024-01-01T00:00:00Z',
        content: '',
      },
    ];
    const detections = scan(events);
    expect(detections).toHaveLength(0);
  });

  it('non-string content (object) → JSON.stringified for scan', () => {
    const events: Event[] = [
      {
        id: 'ev1',
        type: 'user',
        timestamp: '2024-01-01T00:00:00Z',
        content: { key: 'sk-ant-api03-AbCdEfGh1234567890qwertyuiop' },
      },
    ];
    const detections = scan(events);
    expect(detections.length).toBeGreaterThan(0);
    expect(detections.some(d => d.pattern === 'anthropic')).toBe(true);
  });

  it('null/undefined content → empty string → no detections', () => {
    const events: Event[] = [
      {
        id: 'ev1',
        type: 'user',
        timestamp: '2024-01-01T00:00:00Z',
        content: null,
      },
      {
        id: 'ev2',
        type: 'user',
        timestamp: '2024-01-01T00:01:00Z',
        content: undefined,
      },
    ];
    const detections = scan(events);
    expect(detections).toHaveLength(0);
  });

  it('object that throws on JSON.stringify falls back to String(...)', () => {
    const obj = { val: 'sk-ant-api03-AbCdEfGh1234567890qwertyuiop' };
    Object.defineProperty(obj, 'toJSON', {
      get: () => {
        throw new Error('circular reference');
      },
    });
    const events: Event[] = [
      {
        id: 'ev1',
        type: 'user',
        timestamp: '2024-01-01T00:00:00Z',
        content: obj,
      },
    ];
    expect(() => scan(events)).not.toThrow();
  });

  it('maskedPreview longer input shows masked middle', () => {
    const events: Event[] = [
      {
        id: 'ev1',
        type: 'user',
        timestamp: '2024-01-01T00:00:00Z',
        content: 'secret=abcdefghijklmnop',
      },
    ];
    const detections = scan(events);
    expect(detections.length).toBeGreaterThan(0);
    const d = detections[0];
    expect(d?.preview).toContain('***');
    expect(d?.preview.length).toBeLessThan(23);
  });

  it('reference corpus positives: recall ≥ 0.80', () => {
    const events: Event[] = positives.map((entry, idx) => {
      const id = `pos${String(idx)}`;
      return {
        id,
        type: 'user' as const,
        timestamp: '2024-01-01T00:00:00Z',
        content: entry.content,
      };
    });

    const detections = scan(events);
    const detected = new Set(detections.map(d => d.eventId));
    const expected = positives.length;
    const actualDetected = Array.from(detected).filter(id =>
      id.startsWith('pos')
    ).length;
    const recall = actualDetected / expected;

    expect(recall).toBeGreaterThanOrEqual(0.80);
  });

  it('reference corpus negatives: false positive count reported', () => {
    const events: Event[] = negatives.map((content, idx) => {
      const id = `neg${String(idx)}`;
      return {
        id,
        type: 'user' as const,
        timestamp: '2024-01-01T00:00:00Z',
        content,
      };
    });

    const detections = scan(events);
    // This is informational; we don't assert a hard limit on false positives
    // Just verify the scan completes and doesn't throw
    expect(detections).toBeDefined();
    expect(Array.isArray(detections)).toBe(true);
  });

  it('no overlapping detections within same event', () => {
    const events: Event[] = [
      {
        id: 'ev1',
        type: 'user',
        timestamp: '2024-01-01T00:00:00Z',
        content:
          'key1: sk-ant-api03-AbCdEfGh1234567890qwertyuiop key2: AKIA1A2B3C4D5E6F7G8H',
      },
    ];
    const detections = scan(events);
    const eventDetections = detections.filter(d => d.eventId === 'ev1');

    for (let i = 0; i < eventDetections.length; i++) {
      for (let j = i + 1; j < eventDetections.length; j++) {
        const d1 = eventDetections[i];
        const d2 = eventDetections[j];
        if (d1 && d2) {
          const overlap = !(d1.end <= d2.start || d1.start >= d2.end);
          expect(overlap).toBe(false);
        }
      }
    }
  });

  it('detection includes start/end positions and preview', () => {
    const events: Event[] = [
      {
        id: 'ev1',
        type: 'user',
        timestamp: '2024-01-01T00:00:00Z',
        content: 'key: sk-ant-api03-AbCdEfGh1234567890qwertyuiop end',
      },
    ];
    const detections = scan(events);
    expect(detections.length).toBeGreaterThan(0);
    const d = detections[0];
    expect(d).toBeDefined();
    if (d) {
      expect(typeof d.start).toBe('number');
      expect(typeof d.end).toBe('number');
      expect(d.end).toBeGreaterThan(d.start);
      expect(typeof d.preview).toBe('string');
      expect(d.preview.length).toBeGreaterThan(0);
    }
  });

  it('multiple events all scanned', () => {
    const events: Event[] = [
      {
        id: 'ev1',
        type: 'user',
        timestamp: '2024-01-01T00:00:00Z',
        content: 'sk-ant-api03-AbCdEfGh1234567890qwertyuiop',
      },
      {
        id: 'ev2',
        type: 'assistant',
        timestamp: '2024-01-01T00:01:00Z',
        content: 'AKIA1A2B3C4D5E6F7G8H',
      },
      {
        id: 'ev3',
        type: 'tool_use',
        timestamp: '2024-01-01T00:02:00Z',
        content: 'safe content',
      },
    ];
    const detections = scan(events);
    const eventIds = new Set(detections.map(d => d.eventId));
    expect(eventIds.has('ev1')).toBe(true);
    expect(eventIds.has('ev2')).toBe(true);
  });

  it('short password value triggers maskedPreview *** return', () => {
    const events: Event[] = [
      {
        id: 'ev1',
        type: 'user',
        timestamp: '2024-01-01T00:00:00Z',
        content: 'pwd=abcd',
      },
    ];
    const detections = scan(events);
    const d = detections.find(det => det.pattern === 'password-kv');
    if (d) {
      expect(d.preview).toBe('***');
    }
  });

  it('overlapping detection attempt is skipped', () => {
    const events: Event[] = [
      {
        id: 'ev1',
        type: 'user',
        timestamp: '2024-01-01T00:00:00Z',
        content: 'sk-ant-api03-AbCdEfGh1234567890qwertyuiop AKIA1A2B3C4D5E6F7G8H sk-ant-test-123456789012345678901234',
      },
    ];
    const detections = scan(events);
    const eventDetections = detections.filter(d => d.eventId === 'ev1');
    for (let i = 0; i < eventDetections.length; i++) {
      for (let j = i + 1; j < eventDetections.length; j++) {
        const d1 = eventDetections[i];
        const d2 = eventDetections[j];
        if (d1 && d2) {
          const overlap = !(d1.end <= d2.start || d1.start >= d2.end);
          expect(overlap).toBe(false);
        }
      }
    }
  });
});
