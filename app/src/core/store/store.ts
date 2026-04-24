import type { Event } from '../../schemas/event';
import type { UnavailableMarker } from '../../schemas/unavailable';
import type { Filter, LogEntry, StoreItem } from './types';
import { StoreFrozenError } from './types';

// Type guards
function isUnavailableMarker(item: unknown): item is UnavailableMarker {
  return (
    typeof item === 'object' &&
    item !== null &&
    'kind' in item &&
    (item as Record<string, unknown>).kind === 'unavailable'
  );
}

function isLogEntry(item: unknown): item is LogEntry {
  return (
    typeof item === 'object' &&
    item !== null &&
    'kind' in item &&
    (item as Record<string, unknown>).kind === 'log'
  );
}

function isEvent(item: unknown): item is Event {
  return (
    typeof item === 'object' &&
    item !== null &&
    'type' in item &&
    !('kind' in item)
  );
}

type Indexed = StoreItem & { __idx: number };

export class EventStore {
  private readonly items: Indexed[] = [];
  private readonly byId = new Map<string, Indexed>();
  private readonly byType = new Map<string, Set<string>>();
  private _frozen = false;
  private _seq = 0;

  get size(): number {
    return this.items.length;
  }

  get frozen(): boolean {
    return this._frozen;
  }

  add(item: StoreItem): void {
    if (this._frozen) throw new StoreFrozenError();

    const id = this.idOf(item);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const indexed = Object.assign({}, item, {
      __idx: this._seq++,
    }) as Indexed;

    this.items.push(indexed);
    this.byId.set(id, indexed);

    const t = this.typeOf(item);
    let set = this.byType.get(t);
    if (!set) {
      set = new Set();
      this.byType.set(t, set);
    }
    set.add(id);
  }

  freeze(): void {
    this._frozen = true;
  }

  get(id: string): StoreItem | undefined {
    const v = this.byId.get(id);
    if (!v) return undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __idx, ...rest } = v;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return rest as StoreItem;
  }

  query(filter: Filter = {}): ReadonlyArray<StoreItem> {
    let candidates: Indexed[] = this.items;

    if (filter.types && filter.types.length > 0) {
      const allowed = new Set(filter.types);
      candidates = candidates.filter((c) => allowed.has(this.typeOf(c)));
    }

    if (filter.subagentId !== undefined) {
      const sid = filter.subagentId;
      candidates = candidates.filter((c) => this.subagentIdOf(c) === sid);
    }

    if (filter.keyword !== undefined && filter.keyword.length > 0) {
      const kw = filter.keyword.toLowerCase();
      candidates = candidates.filter((c) =>
        JSON.stringify(c).toLowerCase().includes(kw),
      );
    }

    const sorted = [...candidates].sort((a, b) => {
      const ta = this.timestampOf(a);
      const tb = this.timestampOf(b);
      if (ta < tb) return -1;
      if (ta > tb) return 1;
      return a.__idx - b.__idx;
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-unnecessary-type-assertion
    return sorted.map(({ __idx, ...rest }) => rest as StoreItem);
  }

  private idOf(item: StoreItem): string {
    if (isUnavailableMarker(item)) {
      return `unavailable:${item.source_path}:${String(this._seq)}`;
    }
    if (isLogEntry(item)) {
      return item.id;
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return (item as Event).id;
  }

  private typeOf(item: StoreItem): string {
    if (isUnavailableMarker(item)) {
      return 'unavailable';
    }
    if (isLogEntry(item)) {
      return 'log';
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return (item as Event).type;
  }

  private timestampOf(item: StoreItem): string {
    if (isLogEntry(item)) {
      return item.timestamp;
    }
    if (isUnavailableMarker(item)) {
      return '';
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return (item as Event).timestamp;
  }

  private subagentIdOf(item: StoreItem): string | undefined {
    if (!isEvent(item)) {
      return;
    }
    return item.subagent_id;
  }
}
