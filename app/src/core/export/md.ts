import type { EventStore } from '../store/store';
import type { Waterfall } from '../token/types';
import type { Event } from '../../schemas/event';
import type { LogEntry } from '../store/types';

export function exportMarkdown(store: EventStore, waterfall: Waterfall): string {
  const items = store.query();
  const events: Event[] = [];
  const logs: LogEntry[] = [];
  let unavailableCount = 0;
  for (const it of items) {
    if ('kind' in it) {
      if (it.kind === 'log') {
        logs.push(it);
      } else {
        unavailableCount++;
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      events.push(it as Event);
    }
  }

  const lines: string[] = [];
  lines.push('# Claude Clarified Chat — Clarity Corpus');
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Events: ${String(events.length)}`);
  lines.push(`- Log entries: ${String(logs.length)}`);
  lines.push(`- Unavailable markers: ${String(unavailableCount)}`);
  lines.push(`- Total tokens: input=${String(waterfall.total.input)} output=${String(waterfall.total.output)}`);
  lines.push(`- Reconciliation: ${(waterfall.reconciliationPct * 100).toFixed(2)}%`);
  lines.push('');
  lines.push('## Timeline');
  lines.push('');
  for (const ev of events) {
    lines.push(`### ${ev.timestamp} — ${ev.type} (${ev.id})`);
    if (ev.subagent_id !== undefined) lines.push(`Sub-agent: ${ev.subagent_id}`);
    if (ev.tokens) lines.push(`Tokens: input=${String(ev.tokens.input)} output=${String(ev.tokens.output)}`);
    lines.push('');
    lines.push('```');
    lines.push(stringify(ev.content));
    lines.push('```');
    lines.push('');
  }
  if (logs.length > 0) {
    lines.push('## Logs');
    lines.push('');
    for (const l of logs) {
      lines.push(`- \`${l.source_path}\`: ${l.line}`);
    }
    lines.push('');
  }
  lines.push('## Token Waterfall');
  lines.push('');
  lines.push('| Event ID | Input | Output |');
  lines.push('|---|---|---|');
  for (const a of waterfall.perEvent) {
    lines.push(`| ${a.eventId} | ${String(a.tokens.input)} | ${String(a.tokens.output)} |`);
  }
  lines.push('');
  if (waterfall.perSubagent.size > 0) {
    lines.push('### Per Sub-Agent');
    lines.push('');
    lines.push('| Sub-Agent ID | Input | Output |');
    lines.push('|---|---|---|');
    for (const [sid, t] of waterfall.perSubagent) {
      lines.push(`| ${sid} | ${String(t.input)} | ${String(t.output)} |`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

function stringify(content: unknown): string {
  if (typeof content === 'string') return content;
  if (content === null || content === undefined) return '';
  try {
    return JSON.stringify(content, null, 2);
  } catch {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return String(content);
  }
}
