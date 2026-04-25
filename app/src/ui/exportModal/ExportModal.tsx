import { useEffect, useRef } from 'react';
import type { ReactElement } from 'react';

export type ExportModalProps = {
  open: boolean;
  detectionCount: number;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ExportModal({ open, detectionCount, onConfirm, onCancel }: ExportModalProps): ReactElement | null {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open && ref.current !== null) ref.current.focus();
  }, [open]);
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="export-modal-title" tabIndex={-1} ref={ref}>
      <h2 id="export-modal-title">Confirm Export</h2>
      {detectionCount > 0
        ? <p role="alert">{detectionCount} potential secret(s) detected. Acknowledge before exporting.</p>
        : <p>No secrets detected. Proceed with export?</p>}
      <button type="button" onClick={onConfirm}>Confirm export</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </div>
  );
}
