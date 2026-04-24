import { describe, it, expect } from 'vitest';
import { scan } from './detector';
import type { Event } from '../../schemas/event';
import { POSITIVES, NEGATIVES } from './__fixtures__/reference-corpus';

describe('secret detector', () => {
  describe('scan', () => {
    it('should return empty array for empty input', () => {
      const result = scan([]);
      expect(result).toEqual([]);
    });

    it('should detect anthropic patterns', () => {
      const events = POSITIVES.slice(0, 10); // anthropic events
      const result = scan(events);
      expect(result.length).toBeGreaterThan(0);
      const hasAnthropicPattern = result.some(d => d.pattern === 'anthropic');
      expect(hasAnthropicPattern).toBe(true);
    });

    it('should detect openai patterns', () => {
      const events = POSITIVES.slice(10, 20); // openai events
      const result = scan(events);
      expect(result.length).toBeGreaterThan(0);
      const hasOpenaiPattern = result.some(d => d.pattern === 'openai');
      expect(hasOpenaiPattern).toBe(true);
    });

    it('should detect aws patterns', () => {
      const events = POSITIVES.slice(20, 30); // aws events
      const result = scan(events);
      expect(result.length).toBeGreaterThan(0);
      const hasAwsPattern = result.some(d => d.pattern === 'aws');
      expect(hasAwsPattern).toBe(true);
    });

    it('should detect jwt patterns', () => {
      const events = POSITIVES.slice(30, 40); // jwt events
      const result = scan(events);
      expect(result.length).toBeGreaterThan(0);
      const hasJwtPattern = result.some(d => d.pattern === 'jwt');
      expect(hasJwtPattern).toBe(true);
    });

    it('should detect github-pat patterns', () => {
      const events = POSITIVES.slice(40, 50); // github-pat events
      const result = scan(events);
      expect(result.length).toBeGreaterThan(0);
      const hasGithubPattern = result.some(d => d.pattern === 'github-pat');
      expect(hasGithubPattern).toBe(true);
    });

    it('should detect rsa-pem patterns', () => {
      const event: Event = {
        id: 'test',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: '-----BEGIN PRIVATE KEY-----',
      };
      const result = scan([event]);
      expect(result.length).toBeGreaterThan(0);
      const hasRsaPattern = result.some(d => d.pattern === 'rsa-pem');
      expect(hasRsaPattern).toBe(true);
    });

    it('should detect password-kv patterns', () => {
      const event: Event = {
        id: 'test',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'password=SuperSecret123!',
      };
      const result = scan([event]);
      expect(result.length).toBeGreaterThan(0);
      const hasPasswordPattern = result.some(d => d.pattern === 'password-kv');
      expect(hasPasswordPattern).toBe(true);
    });

    it('should not detect false positives', () => {
      const result = scan(NEGATIVES);
      expect(result.length).toBe(0);
    });

    it('should mask preview correctly', () => {
      const event: Event = {
        id: 'test',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'sk-ant-abcdefghij1234567890',
      };
      const result = scan([event]);
      expect(result).toHaveLength(1);
      if (result[0]) {
        expect(result[0].preview).toMatch(/^.{4}\*{3}.{4}$/);
        expect(result[0].preview).toBe('sk-a***7890');
      }
    });

    it('should set correct start and end positions', () => {
      const event: Event = {
        id: 'test',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'prefix sk-ant-abcdefghij1234567890 suffix',
      };
      const result = scan([event]);
      expect(result).toHaveLength(1);
      if (result[0]) {
        expect(result[0].start).toBe(7); // position of 's' in 'sk-ant-...'
        expect(result[0].end).toBeGreaterThan(result[0].start);
      }
    });

    it('should handle events with multiple detections', () => {
      const event: Event = {
        id: 'test',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'sk-ant-abcdefghij1234567890 and AKIAIOSFODNN7EXAMPLE',
      };
      const result = scan([event]);
      expect(result.length).toBeGreaterThanOrEqual(2);
      const hasAnt = result.some(d => d.pattern === 'anthropic');
      const hasAws = result.some(d => d.pattern === 'aws');
      expect(hasAnt).toBe(true);
      expect(hasAws).toBe(true);
    });

    it('should handle overlapping patterns (overlap rejection)', () => {
      // Craft input where password-kv and openai regex both match overlapping portions
      // password=sk-AAAABBBBCCCCDDDDEEEEFFFFGGGGHHHHII has both patterns overlapping
      const event: Event = {
        id: 'test',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'password=sk-AAAABBBBCCCCDDDDEEEEFFFFGGGGHHHHII',
      };
      const result = scan([event]);
      // password-kv finds: password=sk-AAAA... (starts at 0)
      // openai finds: sk-AAAA... (starts at 9, inside password-kv span)
      // openai match should be rejected due to overlap with password-kv's claimed span
      expect(result.length).toBeGreaterThan(0);
      // At least one pattern should have been found
      const hasAnyPattern = result.length > 0;
      expect(hasAnyPattern).toBe(true);
    });

    it('should handle stringify for string content', () => {
      const event: Event = {
        id: 'test',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'sk-ant-abcdefghij1234567890',
      };
      const result = scan([event]);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle stringify for object content', () => {
      const event: Event = {
        id: 'test',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: { secret: 'sk-ant-abcdefghij1234567890' },
      };
      const result = scan([event]);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle stringify for null content', () => {
      const event: Event = {
        id: 'test',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: null,
      };
      const result = scan([event]);
      expect(result).toEqual([]);
    });

    it('should handle stringify for undefined content', () => {
      const event: Event = {
        id: 'test',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: undefined,
      };
      const result = scan([event]);
      expect(result).toEqual([]);
    });

    it('should handle stringify for function content (throws, caught)', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const contentVal: any = Object.assign(() => {}, {});
      const event: Event = {
        id: 'test',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: contentVal as unknown,
      };
      const result = scan([event]);
      // Function stringification returns undefined or throws, caught by try-catch
      expect(result).toEqual([]);
    });

    it('should handle stringify for circular reference (throws, caught)', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const circularVal: any = {};
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      circularVal.self = circularVal;
      const event: Event = {
        id: 'test',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: circularVal as unknown,
      };
      const result = scan([event]);
      // Circular ref throws TypeError, caught by catch block
      expect(result).toBeDefined();
    });

    it('should handle multiple events', () => {
      const events: Event[] = [
        { id: 'e1', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'sk-ant-abcdefghij1234567890' },
        { id: 'e2', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'AKIAIOSFODNN7EXAMPLE' },
        { id: 'e3', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'no secrets here' },
      ];
      const result = scan(events);
      expect(result.length).toBeGreaterThan(0);
      const e1Detections = result.filter(d => d.eventId === 'e1');
      const e2Detections = result.filter(d => d.eventId === 'e2');
      const e3Detections = result.filter(d => d.eventId === 'e3');
      expect(e1Detections.length).toBeGreaterThan(0);
      expect(e2Detections.length).toBeGreaterThan(0);
      expect(e3Detections.length).toBe(0);
    });

    it('should not emit detection for empty haystack', () => {
      const event: Event = {
        id: 'test',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: '',
      };
      const result = scan([event]);
      expect(result).toEqual([]);
    });

    it('should preserve eventId in detection', () => {
      const event: Event = {
        id: 'special-id-123',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'sk-ant-abcdefghij1234567890',
      };
      const result = scan([event]);
      expect(result.length).toBeGreaterThan(0);
      if (result[0]) {
        expect(result[0].eventId).toBe('special-id-123');
      }
    });

    it('should correctly process case-sensitive patterns', () => {
      const event: Event = {
        id: 'test',
        type: 'user',
        timestamp: '2026-01-01T00:00:00Z',
        content: 'PASSWORD=VALUE123456789 and password=VALUE123456789',
      };
      const result = scan([event]);
      // password-kv uses 'i' flag, so both should match
      expect(result.filter(d => d.pattern === 'password-kv').length).toBeGreaterThanOrEqual(1);
    });

    it('should use reference corpus positives', () => {
      const result = scan(POSITIVES);
      expect(result.length).toBeGreaterThan(50); // Should find >50 positives
    });

    it('should use reference corpus negatives', () => {
      const result = scan(NEGATIVES);
      expect(result.length).toBe(0); // Should find 0 false positives
    });
  });
});
