import { describe, it, expect } from 'vitest';
import { unavailable, type UnavailableMarker } from './unavailable';

describe('unavailable', () => {
  it('creates unavailable marker with correct shape', () => {
    const marker = unavailable('file not found', '/path/to/file.txt');
    expect(marker.kind).toBe('unavailable');
    expect(marker.reason).toBe('file not found');
    expect(marker.source_path).toBe('/path/to/file.txt');
  });

  it('returns readonly object', () => {
    const marker = unavailable('test reason', '/test/path');
    expect(Object.isFrozen(marker) || Object.isSealed(marker)).toBe(true);
  });

  it('marker is of type UnavailableMarker', () => {
    const marker = unavailable('reason', 'path');
    const checkType: UnavailableMarker = marker;
    expect(checkType).toBeDefined();
  });

  it('handles special characters in reason', () => {
    const marker = unavailable('error: file <missing> & corrupt', '/path/to/file');
    expect(marker.reason).toBe('error: file <missing> & corrupt');
  });

  it('handles empty reason', () => {
    const marker = unavailable('', '/path');
    expect(marker.reason).toBe('');
  });

  it('handles empty source_path', () => {
    const marker = unavailable('reason', '');
    expect(marker.source_path).toBe('');
  });

  it('handles long reason strings', () => {
    const longReason = 'a'.repeat(1000);
    const marker = unavailable(longReason, '/path');
    expect(marker.reason.length).toBe(1000);
  });
});
