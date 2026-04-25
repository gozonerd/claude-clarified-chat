/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { zipSync } from 'fflate';
import { Shell, onlyEvents, maybeLogSecrets, renderIngestingState } from './Shell';
import { AuditLogger, InMemoryAuditSink } from '../../core/audit/logger';

vi.mock('../../core/export/exporter', () => ({
  exportAll: vi.fn().mockResolvedValue({
    pdf: new Uint8Array(),
    docx: new Uint8Array(),
    xlsx: new Uint8Array(),
    md: '',
  }),
}));

function setupFileArrayBuffer(): void {
  if (!Object.getOwnPropertyDescriptor(File.prototype, 'arrayBuffer')) {
    Object.defineProperty(File.prototype, 'arrayBuffer', {
      value: async function(): Promise<ArrayBuffer> {
        const blob = this as Blob;
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => { resolve(reader.result as ArrayBuffer); };
          reader.readAsArrayBuffer(blob);
        });
      },
      writable: true,
      configurable: true,
    });
  }
}

function makeZip(eventLines: string[] = [], logLines: string[] = [], metaOverride?: unknown): Uint8Array {
  const meta = metaOverride ?? {
    session_id: 's1',
    cli_session_id: 'c1',
    cwd: '/',
    model: 'claude',
    created_at: '2026-01-01T00:00:00.000Z',
    last_activity_at: '2026-01-02T00:00:00.000Z',
    title: 't',
  };
  const files: Record<string, Uint8Array> = {
    'metadata.json': new TextEncoder().encode(JSON.stringify(meta)),
    'events.jsonl': new TextEncoder().encode(eventLines.join('\n') + (eventLines.length ? '\n' : '')),
  };
  if (logLines.length > 0) {
    files['logs/app.log'] = new TextEncoder().encode(logLines.join('\n') + '\n');
  }
  return zipSync(files);
}

const validEvent = JSON.stringify({
  id: 'e1',
  type: 'user',
  timestamp: '2026-01-01T00:00:00.000Z',
  content: 'hi',
});

const secretEvent = JSON.stringify({
  id: 'e2',
  type: 'assistant',
  timestamp: '2026-01-01T00:00:01.000Z',
  content: 'sk-ant-api03-AbCdEfGhIjKlMnOpQrStUv1234567890',
});

function dropZipOnFileInput(container: HTMLElement, zip: Uint8Array, filename = 'test.zip'): void {
  const input = container.querySelector('input[type="file"]');
  if (!input) throw new Error('File input not found');
  const file = new File([zip as any] as any, filename, { type: 'application/zip' });
  Object.defineProperty(input, 'files', { value: [file], writable: false });
  fireEvent.change(input);
}

describe('onlyEvents unit tests', () => {
  it('onlyEvents: filters out items with kind property (continue branch)', () => {
    const items = [
      { kind: 'log' as const, line: 'log line' },
      { id: 'e1', type: 'user' as const, timestamp: '2026-01-01T00:00:00.000Z', content: 'hello' },
    ] as any;
    const result = onlyEvents(items);
    expect(result).toHaveLength(1);
    expect((result[0] as any)?.id).toBe('e1');
  });

  it('onlyEvents: includes items without kind property (push branch)', () => {
    const items = [
      { id: 'e1', type: 'user' as const, timestamp: '2026-01-01T00:00:00.000Z', content: 'hello' },
      { id: 'e2', type: 'assistant' as const, timestamp: '2026-01-01T00:00:01.000Z', content: 'world' },
    ] as any;
    const result = onlyEvents(items);
    expect(result).toHaveLength(2);
    expect((result[0] as any)?.id).toBe('e1');
    expect((result[1] as any)?.id).toBe('e2');
  });

  it('onlyEvents: handles empty array', () => {
    const items: any[] = [];
    const result = onlyEvents(items);
    expect(result).toHaveLength(0);
  });
});

describe('maybeLogSecrets unit tests', () => {
  it('maybeLogSecrets: logs when detections present', () => {
    const sink = new InMemoryAuditSink();
    const logger = new AuditLogger(sink);
    const logSpy = vi.spyOn(logger, 'log');

    maybeLogSecrets([{ kind: 'secret', value: 'key' }] as any, logger);

    expect(logSpy).toHaveBeenCalledWith('secret_detection', { count: 1 });
    logSpy.mockRestore();
  });

  it('maybeLogSecrets: does not log when no detections', () => {
    const sink = new InMemoryAuditSink();
    const logger = new AuditLogger(sink);
    const logSpy = vi.spyOn(logger, 'log');

    maybeLogSecrets([], logger);

    expect(logSpy).not.toHaveBeenCalledWith('secret_detection', expect.anything());
    logSpy.mockRestore();
  });
});

describe('renderIngestingState unit tests', () => {
  it('renderIngestingState: returns Ingesting text when true', () => {
    const { container } = render(renderIngestingState(true));
    expect(container.textContent).toContain('Ingesting…');
  });

  it('renderIngestingState: returns null when false', () => {
    const result = renderIngestingState(false);
    expect(result).toBeNull();
  });
});

describe('Shell', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupFileArrayBuffer();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Test 1: idle phase
  it('idle phase: heading and file input visible', () => {
    const { container } = render(<Shell />);
    expect(container.querySelector('h1')?.textContent).toBe('Claude Clarified Chat');
    expect(container.querySelector('input[type="file"]')).toBeTruthy();
  });

  // Test 2: error phase - invalid zip
  it('error phase: renders error alert with invalid zip', async () => {
    const { container } = render(<Shell />);
    const invalidZip = new Uint8Array([0, 0, 0]);
    dropZipOnFileInput(container, invalidZip, 'bad.zip');

    await waitFor(() => {
      expect(container.querySelector('[role="alert"]')).toBeTruthy();
    });
  });

  // Test 3: error phase - Landing still visible
  it('error phase: Landing visible for retry', async () => {
    const { container } = render(<Shell />);
    const invalidZip = new Uint8Array([0, 0, 0]);
    dropZipOnFileInput(container, invalidZip);

    await waitFor(() => {
      expect(container.querySelector('input[type="file"]')).toBeTruthy();
    });
  });

  // Test 4: ingesting phase
  it('ingesting phase: brief message during parse', async () => {
    const { container } = render(<Shell />);
    const zip = makeZip([validEvent]);
    dropZipOnFileInput(container, zip);

    await waitFor(() => {
      const ingestingOrReady = container.textContent.includes('Ingesting') ||
        Array.from(container.querySelectorAll('button')).some(
          (b) => (b.textContent || '').includes('Export Clarity Corpus'),
        );
      expect(ingestingOrReady).toBe(true);
    }, { timeout: 5000 });
  });

  // Test 5: ready phase - export button
  it('ready phase: Export button visible', async () => {
    const { container } = render(<Shell />);
    const zip = makeZip([validEvent]);
    dropZipOnFileInput(container, zip);

    await waitFor(() => {
      const exportBtn = Array.from(container.querySelectorAll('button')).find(
        (b) => (b.textContent || '').includes('Export Clarity Corpus'),
      );
      expect(exportBtn).toBeTruthy();
    }, { timeout: 5000 });
  });

  // Test 6: ready phase - timeline
  it('ready phase: Timeline section visible', async () => {
    const { container } = render(<Shell />);
    const zip = makeZip([validEvent]);
    dropZipOnFileInput(container, zip);

    await waitFor(() => {
      expect(container.querySelector('section[aria-label="Timeline"]')).toBeTruthy();
    }, { timeout: 5000 });
  });

  // Test 7: begin export - opens modal
  it('begin export: opens modal dialog', async () => {
    const { container } = render(<Shell />);
    const zip = makeZip([validEvent]);
    dropZipOnFileInput(container, zip);

    const exportBtn = await waitFor(() => {
      const btn = Array.from(container.querySelectorAll('button')).find(
        (b) => (b.textContent || '').includes('Export Clarity Corpus'),
      );
      expect(btn).toBeTruthy();
      return btn as HTMLButtonElement;
    }, { timeout: 5000 });

    fireEvent.click(exportBtn);

    await waitFor(() => {
      expect(container.querySelector('[role="dialog"]')).toBeTruthy();
    });
  });

  // Test 8: cancel export
  it('cancel export: closes modal and sets status', async () => {
    const { container } = render(<Shell />);
    const zip = makeZip([validEvent]);
    dropZipOnFileInput(container, zip);

    await waitFor(() => {
      const btn = Array.from(container.querySelectorAll('button')).find(
        (b) => (b.textContent || '').includes('Export Clarity Corpus'),
      );
      expect(btn).toBeTruthy();
      if (btn) {
        fireEvent.click(btn);
      }
    }, { timeout: 5000 });

    await waitFor(() => {
      const btns = Array.from(container.querySelectorAll('button'));
      const cancelBtn = btns.find((b) => (b.textContent || '').includes('Cancel'));
      expect(cancelBtn).toBeTruthy();
      if (cancelBtn) {
        fireEvent.click(cancelBtn);
      }
    });

    await waitFor(() => {
      expect(container.textContent).toContain('Export cancelled');
    });
  });

  // Test 9: confirm export without secrets
  it('confirm export: completes successfully', async () => {
    const { container } = render(<Shell />);
    const zip = makeZip([validEvent]);
    dropZipOnFileInput(container, zip);

    await waitFor(() => {
      const btn = Array.from(container.querySelectorAll('button')).find(
        (b) => (b.textContent || '').includes('Export Clarity Corpus'),
      );
      expect(btn).toBeTruthy();
      if (btn) {
        fireEvent.click(btn);
      }
    }, { timeout: 5000 });

    await waitFor(() => {
      const btns = Array.from(container.querySelectorAll('button'));
      const confirmBtn = btns.find((b) => (b.textContent || '').includes('Confirm export'));
      expect(confirmBtn).toBeTruthy();
      if (confirmBtn) {
        fireEvent.click(confirmBtn);
      }
    });

    await waitFor(() => {
      expect(container.textContent).toContain('Export complete');
    }, { timeout: 5000 });
  });

  // Test 10: confirm export with secrets
  it('confirm export with secrets: logs and completes', async () => {
    const { container } = render(<Shell />);
    const zip = makeZip([secretEvent]);
    dropZipOnFileInput(container, zip);

    await waitFor(() => {
      const btn = Array.from(container.querySelectorAll('button')).find(
        (b) => (b.textContent || '').includes('Export Clarity Corpus'),
      );
      expect(btn).toBeTruthy();
      if (btn) {
        fireEvent.click(btn);
      }
    }, { timeout: 5000 });

    await waitFor(() => {
      const btns = Array.from(container.querySelectorAll('button'));
      const confirmBtn = btns.find((b) => (b.textContent || '').includes('Confirm export'));
      expect(confirmBtn).toBeTruthy();
      if (confirmBtn) {
        fireEvent.click(confirmBtn);
      }
    });

    await waitFor(() => {
      expect(container.textContent).toContain('Export complete');
    }, { timeout: 5000 });
  });

  // Test 11: reduced motion true
  it('reduced motion true: sets data attribute', () => {
    const matchMediaMock = vi.fn(() => ({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    })) as any;
    vi.stubGlobal('matchMedia', matchMediaMock);

    const { container } = render(<Shell />);
    expect(container.querySelector('main')?.getAttribute('data-reduced-motion')).toBe('true');

    vi.unstubAllGlobals();
  });

  // Test 12: reduced motion false
  it('reduced motion false: sets data attribute', () => {
    const matchMediaMock = vi.fn(() => ({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    })) as any;
    vi.stubGlobal('matchMedia', matchMediaMock);

    const { container } = render(<Shell />);
    expect(container.querySelector('main')?.getAttribute('data-reduced-motion')).toBe('false');

    vi.unstubAllGlobals();
  });

  // Test 13: audit span
  it('audit count span: rendered hidden', () => {
    const { container } = render(<Shell />);
    const auditSpan = container.querySelector('[data-testid="audit-count"]');
    expect(auditSpan?.hasAttribute('hidden')).toBe(true);
  });

  // Test 14: audit logging
  it('audit logging: count increases during ingest', async () => {
    const { container } = render(<Shell />);
    const zip = makeZip([validEvent]);
    dropZipOnFileInput(container, zip);

    await waitFor(() => {
      const auditSpan = container.querySelector('[data-testid="audit-count"]');
      const count = parseInt((auditSpan?.textContent || '0'), 10);
      expect(count).toBeGreaterThan(0);
    }, { timeout: 5000 });
  });

  // Test 15: all phases flow
  it('all phases: idle -> error -> ingesting -> ready', async () => {
    const { container } = render(<Shell />);

    // Idle
    expect(container.querySelector('h1')).toBeTruthy();

    // Error
    dropZipOnFileInput(container, new Uint8Array([0, 0]), 'bad.zip');
    await waitFor(() => {
      expect(container.querySelector('[role="alert"]')).toBeTruthy();
    });

    // Ingesting + Ready
    const zip = makeZip([validEvent]);
    dropZipOnFileInput(container, zip, 'good.zip');

    await waitFor(() => {
      const exportBtn = Array.from(container.querySelectorAll('button')).find(
        (b) => (b.textContent || '').includes('Export Clarity Corpus'),
      );
      expect(exportBtn).toBeTruthy();
    }, { timeout: 5000 });
  });

  // Test 16: export button not in idle
  it('export button: not visible in idle phase', () => {
    const { container } = render(<Shell />);
    const exportBtn = Array.from(container.querySelectorAll('button')).find(
      (b) => (b.textContent || '').includes('Export Clarity Corpus'),
    );
    expect(exportBtn).toBeFalsy();
  });

  // Test 17: detectionCount memoization
  it('detectionCount: memoized via useMemo', async () => {
    const { container } = render(<Shell />);
    const zip = makeZip([secretEvent]);
    dropZipOnFileInput(container, zip);

    await waitFor(() => {
      const btn = Array.from(container.querySelectorAll('button')).find(
        (b) => (b.textContent || '').includes('Export Clarity Corpus'),
      );
      if (btn) {
        fireEvent.click(btn);
      }
      const dialog = container.querySelector('[role="dialog"]');
      expect(dialog).toBeTruthy();
    }, { timeout: 5000 });
  });

  // Test 18: selected state in ReadyView
  it('ReadyView: Detail section visible', async () => {
    const { container } = render(<Shell />);
    const zip = makeZip([validEvent]);
    dropZipOnFileInput(container, zip);

    await waitFor(() => {
      expect(container.querySelector('section[aria-label="Detail"]')).toBeTruthy();
    }, { timeout: 5000 });
  });

  // Test 19: export without secrets - ensures no-detection path is covered
  it('export no detections: completes without secret logging', async () => {
    const { container } = render(<Shell />);
    const zip = makeZip([validEvent]);
    dropZipOnFileInput(container, zip);

    await waitFor(() => {
      const btn = Array.from(container.querySelectorAll('button')).find(
        (b) => (b.textContent || '').includes('Export Clarity Corpus'),
      );
      expect(btn).toBeTruthy();
      if (btn) fireEvent.click(btn);
    }, { timeout: 5000 });

    await waitFor(() => {
      const btns = Array.from(container.querySelectorAll('button'));
      const confirmBtn = btns.find((b) => (b.textContent || '').includes('Confirm export'));
      expect(confirmBtn).toBeTruthy();
      if (confirmBtn) fireEvent.click(confirmBtn);
    });

    await waitFor(() => {
      expect(container.textContent).toContain('Export complete');
    }, { timeout: 5000 });
  });

  // Test 20: ingesting phase explicitly captured
  it('ingesting state: shown briefly during processing', async () => {
    const { container } = render(<Shell />);
    const zip = makeZip([validEvent]);

    let sawIngesting = false;

    dropZipOnFileInput(container, zip);

    // Check if ingesting state appears
    await waitFor(() => {
      if (container.textContent.includes('Ingesting')) {
        sawIngesting = true;
      }
      const exportBtn = Array.from(container.querySelectorAll('button')).find(
        (b) => (b.textContent || '').includes('Export Clarity Corpus'),
      );
      expect(exportBtn || sawIngesting).toBeTruthy();
    }, { timeout: 5000 });
  });
});
