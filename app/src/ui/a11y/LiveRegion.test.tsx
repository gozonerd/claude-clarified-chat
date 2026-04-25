import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LiveRegion } from './LiveRegion';

describe('LiveRegion', () => {
  it('renders with aria-live=polite and aria-atomic=true by default', () => {
    render(<LiveRegion message="hello" />);
    const status = screen.getByRole('status');
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.getAttribute('aria-atomic')).toBe('true');
  });

  it('renders message as text content', () => {
    render(<LiveRegion message="hello" />);
    const status = screen.getByRole('status');
    expect(status.textContent).toBe('hello');
  });

  it('updates message when prop changes', () => {
    const { rerender } = render(<LiveRegion message="hello" />);
    const status = screen.getByRole('status');
    expect(status.textContent).toBe('hello');
    rerender(<LiveRegion message="world" />);
    expect(status.textContent).toBe('world');
  });

  it('respects politeness prop: assertive', () => {
    render(<LiveRegion message="hi" politeness="assertive" />);
    const status = screen.getByRole('status');
    expect(status.getAttribute('aria-live')).toBe('assertive');
  });
});
