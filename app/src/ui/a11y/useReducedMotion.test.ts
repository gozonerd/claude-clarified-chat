import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReducedMotion } from './useReducedMotion';

describe('useReducedMotion', () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('returns false when matchMedia is undefined', () => {
    window.matchMedia = undefined as unknown as typeof window.matchMedia;
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('returns false when matchMedia returns matches:false initially', () => {
    window.matchMedia = vi.fn((): MediaQueryList => ({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList));
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('returns true when matchMedia returns matches:true initially', () => {
    window.matchMedia = vi.fn((): MediaQueryList => ({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList));
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('responds to change event: hook value updates when listener is invoked', () => {
    let listener: ((e: MediaQueryListEvent) => void) | null = null;
    window.matchMedia = vi.fn((): MediaQueryList => ({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn((event: string, cb: (e: MediaQueryListEvent) => void) => {
        listener = cb;
      }),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList));
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
    act(() => {
      if (listener) listener({ matches: true } as MediaQueryListEvent);
    });
    expect(result.current).toBe(true);
  });

  it('cleanup: removeEventListener is called on unmount with same listener', () => {
    let listener: ((e: MediaQueryListEvent) => void) | null = null;
    const removeEventListenerSpy = vi.fn();
    window.matchMedia = vi.fn((): MediaQueryList => ({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn((event: string, cb: (e: MediaQueryListEvent) => void) => {
        listener = cb;
      }),
      removeEventListener: removeEventListenerSpy,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList));
    const { unmount } = renderHook(() => useReducedMotion());
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('change', listener);
  });
});
