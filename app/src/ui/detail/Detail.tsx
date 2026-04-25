import type { ReactElement } from 'react';
import type { StoreItem } from '../../core/store/types';

export function Detail({ item }: { item: StoreItem | null }): ReactElement {
  if (item === null) {
    return <section aria-label="Detail"><p>Select an event to view details.</p></section>;
  }
  if ('kind' in item) {
    if (item.kind === 'log') {
      return (
        <section aria-label="Log entry detail">
          <h2>Log entry</h2>
          <pre>{item.line}</pre>
          <p>Source: {item.source_path}</p>
        </section>
      );
    }
    // item.kind === 'unavailable'
    return (
      <section aria-label="Unavailable marker detail">
        <h2>Unavailable</h2>
        <p>{item.reason}</p>
        <p>Source: {item.source_path}</p>
      </section>
    );
  }
  return (
    <section aria-label="Event detail">
      <h2>{item.type} — {item.id}</h2>
      <p>Timestamp: {item.timestamp}</p>
      {item.subagent_id !== undefined ? <p>Sub-agent: {item.subagent_id}</p> : null}
      {item.tokens !== undefined ? <p>Tokens: input={item.tokens.input} output={item.tokens.output}</p> : null}
      <pre>{typeof item.content === 'string' ? item.content : JSON.stringify(item.content, null, 2)}</pre>
    </section>
  );
}
