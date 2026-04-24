import { describe, it, expect } from 'vitest';
import { SecretAckRequiredError } from './types';

describe('SecretAckRequiredError', () => {
  it('should construct with detectionCount', () => {
    const error = new SecretAckRequiredError(2);
    expect(error.detectionCount).toBe(2);
  });

  it('should have correct name', () => {
    const error = new SecretAckRequiredError(1);
    expect(error.name).toBe('SecretAckRequiredError');
  });

  it('should have message with detection count', () => {
    const error = new SecretAckRequiredError(3);
    expect(error.message).toContain('3');
    expect(error.message).toContain('secret pattern(s) detected');
  });

  it('should be instance of Error', () => {
    const error = new SecretAckRequiredError(0);
    expect(error).toBeInstanceOf(Error);
  });
});
