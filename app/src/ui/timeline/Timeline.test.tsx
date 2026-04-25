/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Timeline } from './Timeline';
import type { StoreItem } from '../../core/store/types';

describe('Timeline', () => {
  const mockEvent: StoreItem = {
    id: 'evt-1',
    type: 'user',
    timestamp: '2026-01-01T00:00:00Z',
    content: 'hello',
  };

  const mockToolUseEvent: StoreItem = {
    id: 'evt-2',
    type: 'tool_use',
    timestamp: '2026-01-01T00:00:01Z',
    content: 'use tool',
  };

  const mockLogEntry: StoreItem = {
    kind: 'log',
    id: 'log-1',
    timestamp: '2026-01-01T00:00:00Z',
    line: 'debug info',
    source_path: '/path/to/log',
  };

  const mockUnavailable: StoreItem = {
    kind: 'unavailable',
    reason: 'data truncated',
    source_path: '/path/to/source',
  } as any;

  it('renders timeline section with aria-label', () => {
    const { container } = render(<Timeline items={[]} onSelect={vi.fn()} />);
    const section = container.querySelector('section[aria-label="Timeline"]');
    expect(section).toBeTruthy();
  });

  it('renders all items in unfiltered state', () => {
    const items = [mockEvent, mockToolUseEvent, mockLogEntry, mockUnavailable];
    const { container } = render(<Timeline items={items} onSelect={vi.fn()} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(4);
  });

  it('filters by type', () => {
    const items = [mockEvent, mockToolUseEvent];
    const { container } = render(<Timeline items={items} onSelect={vi.fn()} />);
    const select = container.querySelector('select') as HTMLSelectElement;

    fireEvent.change(select, { target: { value: 'user' } });
    const buttons = container.querySelectorAll('li button');
    expect(buttons).toHaveLength(1);
    expect(buttons[0]?.textContent).toContain('[user]');
  });

  it('filters by keyword', () => {
    const items = [mockEvent, mockToolUseEvent];
    const { container } = render(<Timeline items={items} onSelect={vi.fn()} />);
    const inputs = container.querySelectorAll('input');
    const searchInput = inputs[0] as HTMLInputElement;

    fireEvent.change(searchInput, { target: { value: 'tool' } });
    const buttons = container.querySelectorAll('li button');
    expect(buttons).toHaveLength(1);
    expect(buttons[0]?.textContent).toContain('[tool_use]');
  });

  it('combines type and keyword filters', () => {
    const items = [
      mockEvent,
      { ...mockToolUseEvent, id: 'evt-3', content: 'hello world' },
    ];
    const { container } = render(<Timeline items={items} onSelect={vi.fn()} />);
    const [searchInput] = container.querySelectorAll('input');
    const select = container.querySelector('select') as HTMLSelectElement;

    fireEvent.change(select, { target: { value: 'tool_use' } });
    fireEvent.change(searchInput as HTMLInputElement, { target: { value: 'hello' } });

    const buttons = container.querySelectorAll('li button');
    expect(buttons).toHaveLength(1);
    expect(buttons[0]?.textContent).toContain('[tool_use]');
  });

  it('calls onSelect when button clicked', () => {
    const onSelect = vi.fn();
    const { container } = render(<Timeline items={[mockEvent]} onSelect={onSelect} />);
    const button = container.querySelector('li button');

    fireEvent.click(button as HTMLButtonElement);
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith(mockEvent);
  });

  it('shows event count', () => {
    const items = [mockEvent, mockToolUseEvent];
    const { container } = render(<Timeline items={items} onSelect={vi.fn()} />);
    expect(container.textContent).toContain('2 of 2 events');
  });

  it('updates count when filtering', () => {
    const items = [mockEvent, mockToolUseEvent];
    const { container } = render(<Timeline items={items} onSelect={vi.fn()} />);
    const select = container.querySelector('select') as HTMLSelectElement;

    fireEvent.change(select, { target: { value: 'user' } });
    expect(container.textContent).toContain('1 of 2 events');
  });

  it('renders log items without collision', () => {
    const items = [mockLogEntry, { ...mockLogEntry, id: 'log-2' }];
    const { container } = render(<Timeline items={items} onSelect={vi.fn()} />);
    const buttons = container.querySelectorAll('li button');
    expect(buttons).toHaveLength(2);
  });

  it('renders unavailable items without collision', () => {
    const items = [
      mockUnavailable,
      { ...mockUnavailable, id: 'unavail-2' },
      mockEvent,
    ];
    const { container } = render(<Timeline items={items} onSelect={vi.fn()} />);
    const buttons = container.querySelectorAll('li button');
    expect(buttons).toHaveLength(3);
  });

  it('handles mixed item types', () => {
    const items = [mockEvent, mockLogEntry, mockUnavailable, mockToolUseEvent];
    const { container } = render(<Timeline items={items} onSelect={vi.fn()} />);
    const buttons = container.querySelectorAll('li button');
    expect(buttons).toHaveLength(4);
  });

  it('empty filter returns all', () => {
    const items = [mockEvent, mockToolUseEvent];
    const { container } = render(<Timeline items={items} onSelect={vi.fn()} />);
    const select = container.querySelector('select') as HTMLSelectElement;

    fireEvent.change(select, { target: { value: 'user' } });
    fireEvent.change(select, { target: { value: '' } });

    const buttons = container.querySelectorAll('li button');
    expect(buttons).toHaveLength(2);
  });

  it('renders both event and log items to test all branches', () => {
    const items = [mockEvent, mockLogEntry];
    const { container } = render(<Timeline items={items} onSelect={vi.fn()} />);
    const buttons = container.querySelectorAll('li button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
    const labels = Array.from(buttons).map((b) => b.textContent || '');
    expect(labels.some((l) => l.includes('[user]'))).toBe(true);
    expect(labels.some((l) => l.includes('[log]'))).toBe(true);
  });

  it('filters by log type to ensure typeOf is called for kind items', () => {
    const items = [mockEvent, mockLogEntry, mockUnavailable];
    const { container } = render(<Timeline items={items} onSelect={vi.fn()} />);
    const select = container.querySelector('select') as HTMLSelectElement;

    fireEvent.change(select, { target: { value: 'log' } });
    const buttons = container.querySelectorAll('li button');
    expect(buttons).toHaveLength(1);
    expect(buttons[0]?.textContent).toContain('[log]');
  });

  it('filters by unavailable type to exercise typeOf for unavailable items', () => {
    const items = [mockEvent, mockLogEntry, mockUnavailable];
    const { container } = render(<Timeline items={items} onSelect={vi.fn()} />);
    const select = container.querySelector('select') as HTMLSelectElement;

    fireEvent.change(select, { target: { value: 'unavailable' } });
    const buttons = container.querySelectorAll('li button');
    expect(buttons).toHaveLength(1);
    expect(buttons[0]?.textContent).toContain('[unavailable]');
  });
});
