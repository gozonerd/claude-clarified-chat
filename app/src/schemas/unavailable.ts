export type UnavailableMarker = {
  readonly kind: 'unavailable';
  readonly reason: string;
  readonly source_path: string;
};

export const unavailable = (
  reason: string,
  source_path: string,
): UnavailableMarker => {
  const marker: UnavailableMarker = {
    kind: 'unavailable',
    reason,
    source_path,
  };
  return Object.freeze(marker);
};
