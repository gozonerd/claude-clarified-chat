import type { EventStore } from '../store/store';
import type { EventTokenAttribution, Tokens, Waterfall } from './types';

export function computeWaterfall(store: EventStore, declared: Tokens | null = null): Waterfall {
  const all = store.query();
  const perEvent: EventTokenAttribution[] = [];
  const perSubagent = new Map<string, Tokens>();
  let totalIn = 0, totalOut = 0;

  for (const item of all) {
    if ('kind' in item) continue; // unavailable / log do not contribute
    const ev = item;
    const t = ev.tokens;
    if (!t) continue;
    perEvent.push({ eventId: ev.id, tokens: { input: t.input, output: t.output } });
    totalIn += t.input;
    totalOut += t.output;
    const sid = ev.subagent_id;
    if (sid !== undefined) {
      const cur = perSubagent.get(sid) ?? { input: 0, output: 0 };
      perSubagent.set(sid, { input: cur.input + t.input, output: cur.output + t.output });
    }
  }

  const total: Tokens = { input: totalIn, output: totalOut };
  let reconciliationPct = 1;
  if (declared !== null) {
    const declaredTotal = declared.input + declared.output;
    if (declaredTotal === 0) {
      reconciliationPct = totalIn + totalOut === 0 ? 1 : 0;
    } else {
      reconciliationPct = (totalIn + totalOut) / declaredTotal;
    }
  }
  return { total, perEvent, perSubagent, declared, reconciliationPct };
}
