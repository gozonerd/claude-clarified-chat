import { Document, Packer, Paragraph, HeadingLevel, TextRun } from 'docx';
import type { EventStore } from '../store/store';
import type { Waterfall } from '../token/types';

export async function exportDocx(store: EventStore, waterfall: Waterfall): Promise<Uint8Array> {
  const items = store.query();
  const children: Paragraph[] = [
    new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Claude Clarified Chat — Clarity Corpus')] }),
    new Paragraph({ children: [new TextRun(`Total tokens: input=${String(waterfall.total.input)} output=${String(waterfall.total.output)}`)] }),
    new Paragraph({ children: [new TextRun(`Reconciliation: ${(waterfall.reconciliationPct * 100).toFixed(2)}%`)] }),
    new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Timeline')] }),
  ];

  for (const it of items) {
    if ('kind' in it) {
      children.push(new Paragraph({ children: [new TextRun(`[${it.kind}]`)] }));
    } else {
      children.push(new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(`${it.timestamp} — ${it.type} (${it.id})`)] }));
    }
  }

  const doc = new Document({ sections: [{ children }] });
  const buf = await Packer.toBuffer(doc);
  return new Uint8Array(buf);
}
