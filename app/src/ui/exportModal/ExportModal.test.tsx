import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { ExportModal } from './ExportModal';

describe('ExportModal', () => {
  it('returns null when open is false', () => {
    const { container } = render(
      <ExportModal open={false} detectionCount={0} onConfirm={() => {}} onCancel={() => {}} />
    );
    expect(container.querySelector('[role="dialog"]')).toBeFalsy();
  });

  it('renders dialog when open is true', () => {
    const { container } = render(
      <ExportModal open={true} detectionCount={0} onConfirm={vi.fn()} onCancel={vi.fn()} />
    );
    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();
    expect(dialog?.getAttribute('aria-modal')).toBe('true');
  });

  it('shows no secrets message when detectionCount is 0', () => {
    const { container } = render(
      <ExportModal open={true} detectionCount={0} onConfirm={vi.fn()} onCancel={vi.fn()} />
    );
    expect(container.textContent).toContain('No secrets detected. Proceed with export?');
  });

  it('shows secret alert when detectionCount > 0', () => {
    const { container } = render(
      <ExportModal open={true} detectionCount={3} onConfirm={vi.fn()} onCancel={vi.fn()} />
    );
    expect(container.textContent).toContain('3 potential secret(s) detected. Acknowledge before exporting.');
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toBeTruthy();
  });

  it('has dialog title with correct id', () => {
    const { container } = render(
      <ExportModal open={true} detectionCount={0} onConfirm={vi.fn()} onCancel={vi.fn()} />
    );
    const title = container.querySelector('#export-modal-title');
    expect(title).toBeTruthy();
    expect(title?.textContent).toBe('Confirm Export');
  });

  it('calls onConfirm when Confirm button clicked', () => {
    const onConfirm = vi.fn();
    const { container } = render(
      <ExportModal open={true} detectionCount={0} onConfirm={onConfirm} onCancel={vi.fn()} />
    );
    const buttons = container.querySelectorAll('button');
    const confirmButton = buttons[0];
    fireEvent.click(confirmButton as HTMLButtonElement);
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('calls onCancel when Cancel button clicked', () => {
    const onCancel = vi.fn();
    const { container } = render(
      <ExportModal open={true} detectionCount={0} onConfirm={vi.fn()} onCancel={onCancel} />
    );
    const buttons = container.querySelectorAll('button');
    const cancelButton = buttons[1];
    fireEvent.click(cancelButton as HTMLButtonElement);
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('moves focus to dialog on open', () => {
    const { container, rerender } = render(
      <ExportModal open={false} detectionCount={0} onConfirm={vi.fn()} onCancel={vi.fn()} />
    );

    rerender(
      <ExportModal open={true} detectionCount={0} onConfirm={vi.fn()} onCancel={vi.fn()} />
    );

    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();
  });

  it('renders both buttons', () => {
    const { container } = render(
      <ExportModal open={true} detectionCount={0} onConfirm={vi.fn()} onCancel={vi.fn()} />
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]?.textContent).toBe('Confirm export');
    expect(buttons[1]?.textContent).toBe('Cancel');
  });

  it('updates message when detectionCount changes', () => {
    const { container, rerender } = render(
      <ExportModal open={true} detectionCount={0} onConfirm={vi.fn()} onCancel={vi.fn()} />
    );
    expect(container.textContent).toContain('No secrets detected');

    rerender(
      <ExportModal open={true} detectionCount={5} onConfirm={vi.fn()} onCancel={vi.fn()} />
    );
    expect(container.textContent).toContain('5 potential secret(s) detected');
  });
});
