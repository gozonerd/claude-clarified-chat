import type { Event } from '../../schemas/event';
import type { UnavailableMarker } from '../../schemas/unavailable';

export type LogEntry = {
  readonly kind: 'log';
  readonly id: string;
  readonly timestamp: string;
  readonly line: string;
  readonly source_path: string;
};

export type StoreItem = Event | UnavailableMarker | LogEntry;

export type Filter = {
  types?: ReadonlyArray<string>;
  subagentId?: string;
  keyword?: string;
};

export class StoreFrozenError extends Error {
  constructor() {
    super('EventStore is frozen');
    this.name = 'StoreFrozenError';
  }
}
