import { useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import type { StoreItem } from '../../core/store/types';

export type TimelineProps = {
  items: ReadonlyArray<StoreItem>;
  onSelect: (item: StoreItem) => void;
};

function labelOf(it: StoreItem): string {
  if ('kind' in it) return `[${it.kind}]`;
  return `[${it.type}] ${it.id}`;
}

function typeOf(it: StoreItem): string {
  if ('kind' in it) {
    return it.kind;
  }
  return it.type;
}

export function Timeline({ items, onSelect }: TimelineProps): ReactElement {
  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (typeFilter !== '' && typeOf(it) !== typeFilter) return false;
      if (keyword !== '' && !JSON.stringify(it).toLowerCase().includes(keyword.toLowerCase())) return false;
      return true;
    });
  }, [items, keyword, typeFilter]);

  return (
    <section aria-label="Timeline">
      <div>
        <label>
          <span>Filter by type</span>
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); }}
            aria-label="Filter by event type"
          >
            <option value="">All</option>
            <option value="user">user</option>
            <option value="assistant">assistant</option>
            <option value="tool_use">tool_use</option>
            <option value="tool_result">tool_result</option>
            <option value="thinking">thinking</option>
            <option value="system">system</option>
            <option value="queue-operation">queue-operation</option>
            <option value="last-prompt">last-prompt</option>
            <option value="custom-title">custom-title</option>
            <option value="attachment">attachment</option>
            <option value="log">log</option>
            <option value="unavailable">unavailable</option>
          </select>
        </label>
        <label>
          <span>Search</span>
          <input
            type="search"
            value={keyword}
            onChange={(e) => { setKeyword(e.target.value); }}
            aria-label="Search timeline by keyword"
          />
        </label>
      </div>
      <p>{filtered.length} of {items.length} events</p>
      <ul>
        {filtered.map((it, i) => {
          const label = labelOf(it);
          const key = 'kind' in it && it.kind === 'log' ? it.id : 'kind' in it ? `unavailable-${String(i)}` : it.id;
          return (
            <li key={`${key}-${String(i)}`}>
              <button type="button" onClick={() => { onSelect(it); }} aria-label={`Open detail for ${label}`}>{label}</button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
