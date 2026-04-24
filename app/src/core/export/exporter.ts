import type { EventStore } from '../store/store';
import type { Event } from '../../schemas/event';
import type { Waterfall } from '../token/types';
import { scan } from '../secret/detector';
import { exportMarkdown } from './md';
import { exportPdf } from './pdf';
import { exportDocx } from './docx';
import { exportXlsx } from './xlsx';
import { SecretAckRequiredError, type ExportArtifacts } from './types';

export async function exportAll(store: EventStore, waterfall: Waterfall, secretAck: boolean): Promise<ExportArtifacts> {
  const events: Event[] = [];
  for (const it of store.query()) {
    if (!('kind' in it)) events.push(it);
  }
  const detections = scan(events);
  if (detections.length > 0 && !secretAck) {
    throw new SecretAckRequiredError(detections.length);
  }
  const [pdf, docx, xlsx, md] = await Promise.all([
    exportPdf(store, waterfall),
    exportDocx(store, waterfall),
    exportXlsx(store, waterfall),
    Promise.resolve(exportMarkdown(store, waterfall)),
  ]);
  return { pdf, docx, xlsx, md };
}
