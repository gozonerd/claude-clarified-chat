import { useCallback, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent, KeyboardEvent, ReactElement } from 'react';

export type LandingProps = {
  onZipBytes: (bytes: Uint8Array, filename: string) => void;
  busy?: boolean;
};

export function Landing({ onZipBytes, busy = false }: LandingProps): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(async (file: File): Promise<void> => {
    const buf = await file.arrayBuffer();
    onZipBytes(new Uint8Array(buf), file.name);
  }, [onZipBytes]);

  const onDrop = useCallback((e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file !== undefined) void handleFile(file);
  }, [handleFile]);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file !== undefined) void handleFile(file);
  }, [handleFile]);

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inputRef.current?.click();
    }
  }, []);

  const onDragOver = useCallback((e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback((): void => { setDragOver(false); }, []);
  const onClick = useCallback((): void => { inputRef.current?.click(); }, []);

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Drop a Claude thread export zip here, or activate to browse"
        aria-busy={busy}
        data-drag-over={dragOver}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onKeyDown={onKeyDown}
        onClick={onClick}
        style={{ border: '2px dashed currentColor', padding: 24, outline: 'none' }}
      >
        <p>Drop a Claude thread export <code>.zip</code> here, or press Enter to choose a file.</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".zip,application/zip"
        onChange={onChange}
        aria-label="Choose a zip file"
        style={{ position: 'absolute', left: -10000, width: 1, height: 1 }}
      />
    </div>
  );
}
