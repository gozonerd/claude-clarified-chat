import ExcelJS from 'exceljs';
import type { EventStore } from '../store/store';
import type { Waterfall } from '../token/types';
import type { Event } from '../../schemas/event';

export async function exportXlsx(store: EventStore, waterfall: Waterfall): Promise<Uint8Array> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Claude Clarified Chat';
  wb.created = new Date(0);

  const evSheet = wb.addWorksheet('Events');
  evSheet.columns = [
    { header: 'id', key: 'id', width: 30 },
    { header: 'type', key: 'type', width: 14 },
    { header: 'timestamp', key: 'timestamp', width: 26 },
    { header: 'subagent_id', key: 'subagent_id', width: 24 },
    { header: 'input_tokens', key: 'input_tokens', width: 12 },
    { header: 'output_tokens', key: 'output_tokens', width: 12 },
  ];
  for (const it of store.query()) {
    if ('kind' in it) continue;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const ev = it as Event;
    evSheet.addRow({
      id: ev.id, type: ev.type, timestamp: ev.timestamp,
      subagent_id: ev.subagent_id ?? '',
      input_tokens: ev.tokens?.input ?? 0,
      output_tokens: ev.tokens?.output ?? 0,
    });
  }

  const wfSheet = wb.addWorksheet('TokenWaterfall');
  wfSheet.columns = [
    { header: 'event_id', key: 'event_id', width: 30 },
    { header: 'input', key: 'input', width: 12 },
    { header: 'output', key: 'output', width: 12 },
  ];
  for (const a of waterfall.perEvent) {
    wfSheet.addRow({ event_id: a.eventId, input: a.tokens.input, output: a.tokens.output });
  }

  const saSheet = wb.addWorksheet('SubAgents');
  saSheet.columns = [
    { header: 'subagent_id', key: 'subagent_id', width: 30 },
    { header: 'input', key: 'input', width: 12 },
    { header: 'output', key: 'output', width: 12 },
  ];
  for (const [sid, t] of waterfall.perSubagent) {
    saSheet.addRow({ subagent_id: sid, input: t.input, output: t.output });
  }

  const buf = await wb.xlsx.writeBuffer();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  return new Uint8Array(buf as ArrayBuffer);
}
