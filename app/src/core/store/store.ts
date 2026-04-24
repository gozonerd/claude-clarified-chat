import type { Event } from '../../schemas/event';
import type { Filter, StoreItem } from './types';
import { StoreFrozenError } from './types';

type Indexed = StoreItem & { __idx: number };

export class EventStore {
  private readonly items: Indexed[] = [];
  private readonly byId = new Map<string, Indexed>();
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
    // __idx ensures Indexed type
    const indexed: Indexed = { ...item, __idx: this._seq++ };
    this.items.push(indexed);
    this.byId.set(id, indexed);
  }

  freeze(): void {
    this._frozen = true;
  }

  get(id: string): StoreItem | undefined {
    const v = this.byId.get(id);
    if (!v) return undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __idx, ...rest } = v;
    return rest;
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

    return sorted.map(({ __idx, ...rest }) => {
      void __idx; // mark as intentionally unused
      return rest;
    });
  }

  private idOf(item: StoreItem): string {
    if ('kind' in item && item.kind === 'unavailable') {
      return `unavailable:${item.source_path}:${String(this._seq)}`;
    }
    if ('kind' in item) {
      // item.kind === 'log'
      return item.id;
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return (item as Event).id;
  }

  private typeOf(item: StoreItem): string {
    if ('kind' in item) {
      return item.kind;
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return (item as Event).type;
  }

  private timestampOf(item: StoreItem): string {
    if ('kind' in item) {
      if (item.kind === 'log') {
        return item.timestamp;
      }
      // item.kind === 'unavailable'
      return '';
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return (item as Event).timestamp;
  }

  private subagentIdOf(item: StoreItem): string | undefined {
    if ('kind' in item) {
      return undefined;
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return (item as Event).subagent_id;
  }
}
