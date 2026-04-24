import { PDFDocument, StandardFonts } from 'pdf-lib';
import type { EventStore } from '../store/store';
import type { Waterfall } from '../token/types';

export async function exportPdf(store: EventStore, waterfall: Waterfall): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle('Claude Clarified Chat — Clarity Corpus');
  doc.setLanguage('en-US');
  doc.setProducer('Claude Clarified Chat');

  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const page = doc.addPage([612, 792]);
  const { height } = page.getSize();
  let y = height - 50;

  page.drawText('Claude Clarified Chat — Clarity Corpus', { x: 50, y, size: 18, font: fontBold });
  y -= 30;
  page.drawText(`Total tokens: input=${String(waterfall.total.input)} output=${String(waterfall.total.output)}`, { x: 50, y, size: 10, font });
  y -= 14;
  page.drawText(`Reconciliation: ${(waterfall.reconciliationPct * 100).toFixed(2)}%`, { x: 50, y, size: 10, font });
  y -= 20;

  const items = store.query();
  page.drawText(`Items: ${String(items.length)}`, { x: 50, y, size: 10, font });
  y -= 20;

  let currentPage = page;
  for (const it of items) {
    if (y < 60) {
      currentPage = doc.addPage([612, 792]);
      y = height - 50;
    }
    const label = 'kind' in it ? `[${it.kind}]` : `[${it.type}] ${it.id}`;
    currentPage.drawText(label.slice(0, 80), { x: 50, y, size: 9, font });
    y -= 12;
  }

  return await doc.save();
}
