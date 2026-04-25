/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-non-null-assertion */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Landing } from './Landing';

describe('Landing', () => {
  let inputClickSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    inputClickSpy = vi.fn();
    Object.defineProperty(HTMLInputElement.prototype, 'click', {
      value: inputClickSpy,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(File.prototype, 'arrayBuffer', {
      value: vi.fn(async function(this: Blob): Promise<ArrayBuffer> {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => { resolve(reader.result as ArrayBuffer); };
          reader.readAsArrayBuffer(this);
        });
      }),
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders drop zone with role button and aria-label', () => {
    const { container } = render(<Landing onZipBytes={vi.fn()} />);
    const dropZone = container.querySelector('[role="button"]');
    expect(dropZone).toBeTruthy();
    expect(dropZone?.getAttribute('aria-label')).toContain('Drop a Claude thread export zip');
  });

  it('aria-busy is false by default', () => {
    const { container } = render(<Landing onZipBytes={vi.fn()} />);
    const dropZone = container.querySelector('[role="button"]');
    expect(dropZone?.getAttribute('aria-busy')).toBe('false');
  });

  it('aria-busy reflects busy prop', () => {
    const { container } = render(<Landing onZipBytes={vi.fn()} busy={true} />);
    const dropZone = container.querySelector('[role="button"]');
    expect(dropZone?.getAttribute('aria-busy')).toBe('true');
  });

  it('calls onZipBytes on file input change', async () => {
    const onZipBytes = vi.fn();
    const { container } = render(<Landing onZipBytes={onZipBytes} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    const file = new File(['test content'], 'test.zip', { type: 'application/zip' });
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);
    await waitFor(() => {
      expect(onZipBytes).toHaveBeenCalledOnce();
      const [bytes, filename] = onZipBytes.mock.calls[0]!;
      expect(bytes).toBeInstanceOf(Uint8Array);
      expect(filename).toBe('test.zip');
    });
  });

  it('does not call onZipBytes when no files selected', () => {
    const onZipBytes = vi.fn();
    const { container } = render(<Landing onZipBytes={onZipBytes} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [],
      writable: false,
    });

    fireEvent.change(input);
    expect(onZipBytes).not.toHaveBeenCalled();
  });

  it('calls onZipBytes on drop with file', async () => {
    const onZipBytes = vi.fn();
    const { container } = render(<Landing onZipBytes={onZipBytes} />);
    const dropZone = container.querySelector('[role="button"]') as HTMLDivElement;

    const file = new File(['zip content'], 'archive.zip', { type: 'application/zip' });
    const dataTransfer = {
      files: [file],
    } as any;

    fireEvent.drop(dropZone, { dataTransfer: dataTransfer });
    await waitFor(() => {
      expect(onZipBytes).toHaveBeenCalledOnce();
      const [bytes, filename] = onZipBytes.mock.calls[0]!;
      expect(bytes).toBeInstanceOf(Uint8Array);
      expect(filename).toBe('archive.zip');
    });
  });

  it('does not call onZipBytes on drop with no files', () => {
    const onZipBytes = vi.fn();
    const { container } = render(<Landing onZipBytes={onZipBytes} />);
    const dropZone = container.querySelector('[role="button"]') as HTMLDivElement;

    const dataTransfer = {
      files: [],
    } as any;
    fireEvent.drop(dropZone, { dataTransfer: dataTransfer });
    expect(onZipBytes).not.toHaveBeenCalled();
  });

  it('sets data-drag-over on dragover', () => {
    const { container } = render(<Landing onZipBytes={vi.fn()} />);
    const dropZone = container.querySelector('[role="button"]') as HTMLDivElement;

    fireEvent.dragOver(dropZone);
    expect(dropZone.getAttribute('data-drag-over')).toBe('true');
  });

  it('clears data-drag-over on dragleave', () => {
    const { container } = render(<Landing onZipBytes={vi.fn()} />);
    const dropZone = container.querySelector('[role="button"]') as HTMLDivElement;

    fireEvent.dragOver(dropZone);
    expect(dropZone.getAttribute('data-drag-over')).toBe('true');
    fireEvent.dragLeave(dropZone);
    expect(dropZone.getAttribute('data-drag-over')).toBe('false');
  });

  it('triggers input click on drop zone click', () => {
    const { container } = render(<Landing onZipBytes={vi.fn()} />);
    const dropZone = container.querySelector('[role="button"]') as HTMLDivElement;

    fireEvent.click(dropZone);
    expect(inputClickSpy).toHaveBeenCalledOnce();
  });

  it('triggers input click on Enter key', () => {
    const { container } = render(<Landing onZipBytes={vi.fn()} />);
    const dropZone = container.querySelector('[role="button"]') as HTMLDivElement;

    fireEvent.keyDown(dropZone, { key: 'Enter' });
    expect(inputClickSpy).toHaveBeenCalledOnce();
  });

  it('triggers input click on Space key', () => {
    const { container } = render(<Landing onZipBytes={vi.fn()} />);
    const dropZone = container.querySelector('[role="button"]') as HTMLDivElement;

    fireEvent.keyDown(dropZone, { key: ' ' });
    expect(inputClickSpy).toHaveBeenCalledOnce();
  });

  it('does not trigger click on other keys', () => {
    const { container } = render(<Landing onZipBytes={vi.fn()} />);
    const dropZone = container.querySelector('[role="button"]') as HTMLDivElement;

    fireEvent.keyDown(dropZone, { key: 'a' });
    expect(inputClickSpy).not.toHaveBeenCalled();
  });

  it('clears drag-over on drop', async () => {
    const { container } = render(<Landing onZipBytes={vi.fn()} />);
    const dropZone = container.querySelector('[role="button"]') as HTMLDivElement;

    fireEvent.dragOver(dropZone);
    expect(dropZone.getAttribute('data-drag-over')).toBe('true');

    const file = new File(['test'], 'test.zip');
    const dataTransfer = {
      files: [file],
    } as any;
    fireEvent.drop(dropZone, { dataTransfer: dataTransfer });

    await waitFor(() => {
      expect(dropZone.getAttribute('data-drag-over')).toBe('false');
    });
  });
});
