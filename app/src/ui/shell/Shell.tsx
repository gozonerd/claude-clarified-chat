import { useCallback, useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import { ingest } from '../../core/ingest/ingest';
import { parse } from '../../core/parse/parser';
import { computeWaterfall } from '../../core/token/waterfall';
import { exportAll } from '../../core/export/exporter';
import { scan } from '../../core/secret/detector';
import { AuditLogger, InMemoryAuditSink } from '../../core/audit/logger';
import { LiveRegion } from '../a11y/LiveRegion';
import { useReducedMotion } from '../a11y/useReducedMotion';
import { Landing } from '../landing/Landing';
import { Timeline } from '../timeline/Timeline';
import { Detail } from '../detail/Detail';
import { ExportModal } from '../exportModal/ExportModal';
import type { StoreItem } from '../../core/store/types';
import type { Event } from '../../schemas/event';
import type { EventStore } from '../../core/store/store';
import type { Waterfall } from '../../core/token/types';

type ReadyState = { phase: 'ready'; store: EventStore; waterfall: Waterfall };
type State =
  | { phase: 'idle' }
  | { phase: 'ingesting' }
  | { phase: 'error'; message: string }
  | ReadyState;

export function onlyEvents(items: ReadonlyArray<StoreItem>): Event[] {
  const out: Event[] = [];
  for (const it of items) {
    if ('kind' in it) continue;
    out.push(it);
  }
  return out;
}

export function maybeLogSecrets(
  dets: ReturnType<typeof scan>,
  logger: AuditLogger,
): void {
  if (dets.length > 0) {
    logger.log('secret_detection', { count: dets.length });
  }
}

export function renderIngestingState(isIngesting: boolean): ReactElement | null {
  return isIngesting ? <p>Ingesting…</p> : null;
}

function ReadyView(props: {
  state: ReadyState;
  logger: AuditLogger;
  setStatus: (s: string) => void;
}): ReactElement {
  const { state, logger, setStatus } = props;
  const [selected, setSelected] = useState<StoreItem | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  const events = useMemo(() => onlyEvents(state.store.query()), [state]);
  const detectionCount = useMemo(() => scan(events).length, [events]);

  const beginExport = useCallback((): void => { setExportOpen(true); }, []);
  const cancelExport = useCallback((): void => {
    setExportOpen(false);
    setStatus('Export cancelled.');
  }, [setStatus]);
  const confirmExport = useCallback(async (): Promise<void> => {
    setExportOpen(false);
    setStatus('Exporting Clarity Corpus…');
    logger.log('export_start', {});
    const dets = scan(events);
    maybeLogSecrets(dets, logger);
    await exportAll(state.store, state.waterfall, true);
    setStatus('Export complete.');
    logger.log('export_complete', {});
  }, [state, logger, events, setStatus]);

  return (
    <>
      <button type="button" onClick={beginExport}>Export Clarity Corpus</button>
      <Timeline items={state.store.query()} onSelect={setSelected} />
      <Detail item={selected} />
      <ExportModal
        open={exportOpen}
        detectionCount={detectionCount}
        onConfirm={() => { void confirmExport(); }}
        onCancel={cancelExport}
      />
    </>
  );
}

export function Shell(): ReactElement {
  const [state, setState] = useState<State>({ phase: 'idle' });
  const [status, setStatus] = useState('');
  const reduced = useReducedMotion();
  const [sink] = useState(() => new InMemoryAuditSink());
  const [logger] = useState(() => new AuditLogger(sink));

  const onZipBytes = useCallback(async (bytes: Uint8Array, filename: string): Promise<void> => {
    setState({ phase: 'ingesting' });
    setStatus(`Ingesting ${filename}…`);
    logger.log('ingest_start', { filename });
    const r = ingest(bytes);
    if (!r.ok) {
      setState({ phase: 'error', message: r.error.message });
      setStatus(`Ingest failed: ${r.error.message}`);
      logger.log('parse_error', { stage: 'ingest', message: r.error.message });
      return;
    }
    const result = await parse(r.files);
    const waterfall = computeWaterfall(result.store);
    setState({ phase: 'ready', store: result.store, waterfall });
    setStatus(`Loaded ${String(result.store.size)} timeline items.`);
    logger.log('ingest_complete', { items: result.store.size });
  }, [logger]);

  return (
    <main data-reduced-motion={reduced ? 'true' : 'false'}>
      <h1>Claude Clarified Chat</h1>
      <LiveRegion message={status} />
      {state.phase === 'idle' ? <Landing onZipBytes={(b, n) => { void onZipBytes(b, n); }} /> : null}
      {state.phase === 'error' ? (
        <>
          <p role="alert">Error: {state.message}</p>
          <Landing onZipBytes={(b, n) => { void onZipBytes(b, n); }} />
        </>
      ) : null}
      {renderIngestingState(state.phase === 'ingesting')}
      {state.phase === 'ready' ? <ReadyView state={state} logger={logger} setStatus={setStatus} /> : null}
      <span data-testid="audit-count" hidden>{String(sink.snapshot().length)}</span>
    </main>
  );
}
