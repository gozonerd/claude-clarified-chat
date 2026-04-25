import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Detail } from './Detail';
import type { StoreItem } from '../../core/store/types';

describe('Detail', () => {
  it('renders null item message', () => {
    const { container } = render(<Detail item={null} />);
    expect(container.textContent).toContain('Select an event to view details.');
  });

  it('renders log entry', () => {
    const item: StoreItem = {
      kind: 'log',
      id: 'log-1',
      timestamp: '2026-01-01T00:00:00Z',
      line: 'debug info here',
      source_path: '/path/to/log.txt',
    };
    const { container } = render(<Detail item={item} />);
    expect(container.textContent).toContain('Log entry');
    expect(container.textContent).toContain('debug info here');
    expect(container.textContent).toContain('Source: /path/to/log.txt');
  });

  it('renders unavailable marker', () => {
    const item = {
      kind: 'unavailable',
      reason: 'data truncated by ingest',
      source_path: '/source/path',
    } as StoreItem;
    const { container } = render(<Detail item={item} />);
    expect(container.textContent).toContain('Unavailable');
    expect(container.textContent).toContain('data truncated by ingest');
    expect(container.textContent).toContain('Source: /source/path');
  });

  it('renders event with both subagent_id and tokens', () => {
    const item: StoreItem = {
      id: 'evt-1',
      type: 'tool_use',
      timestamp: '2026-01-01T00:00:00Z',
      content: 'use tool',
      subagent_id: 'sub-1',
      tokens: { input: 100, output: 50 },
    };
    const { container } = render(<Detail item={item} />);
    expect(container.textContent).toContain('tool_use — evt-1');
    expect(container.textContent).toContain('Sub-agent: sub-1');
    expect(container.textContent).toContain('Tokens: input=100 output=50');
  });

  it('renders event with only subagent_id', () => {
    const item: StoreItem = {
      id: 'evt-2',
      type: 'assistant',
      timestamp: '2026-01-01T00:00:01Z',
      content: 'response',
      subagent_id: 'sub-2',
    };
    const { container } = render(<Detail item={item} />);
    expect(container.textContent).toContain('Sub-agent: sub-2');
    expect(container.textContent).not.toContain('Tokens:');
  });

  it('renders event with only tokens', () => {
    const item: StoreItem = {
      id: 'evt-3',
      type: 'user',
      timestamp: '2026-01-01T00:00:02Z',
      content: 'hello',
      tokens: { input: 10, output: 0 },
    };
    const { container } = render(<Detail item={item} />);
    expect(container.textContent).toContain('Tokens: input=10 output=0');
    expect(container.textContent).not.toContain('Sub-agent:');
  });

  it('renders event with neither subagent_id nor tokens', () => {
    const item: StoreItem = {
      id: 'evt-4',
      type: 'system',
      timestamp: '2026-01-01T00:00:03Z',
      content: 'system message',
    };
    const { container } = render(<Detail item={item} />);
    expect(container.textContent).not.toContain('Sub-agent:');
    expect(container.textContent).not.toContain('Tokens:');
  });

  it('renders event with string content as-is', () => {
    const item: StoreItem = {
      id: 'evt-5',
      type: 'user',
      timestamp: '2026-01-01T00:00:04Z',
      content: 'hello world',
    };
    const { container } = render(<Detail item={item} />);
    const pre = container.querySelector('pre');
    expect(pre?.textContent).toBe('hello world');
  });

  it('renders event with object content as JSON', () => {
    const item: StoreItem = {
      id: 'evt-6',
      type: 'tool_use',
      timestamp: '2026-01-01T00:00:05Z',
      content: { name: 'my_tool', input: { param: 'value' } },
    };
    const { container } = render(<Detail item={item} />);
    const pre = container.querySelector('pre');
    expect(pre?.textContent).toContain('name');
    expect(pre?.textContent).toContain('my_tool');
  });

  it('displays timestamp', () => {
    const item: StoreItem = {
      id: 'evt-7',
      type: 'assistant',
      timestamp: '2026-03-15T14:30:00Z',
      content: 'reply',
    };
    const { container } = render(<Detail item={item} />);
    expect(container.textContent).toContain('2026-03-15T14:30:00Z');
  });
});
