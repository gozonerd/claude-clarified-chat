import { useEffect, useRef } from 'react';
import type { ReactElement } from 'react';

export type LiveRegionProps = { message: string; politeness?: 'polite' | 'assertive' };

export function LiveRegion({ message, politeness = 'polite' }: LiveRegionProps): ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current !== null) ref.current.textContent = message;
  }, [message]);
  return (
    <div
      ref={ref}
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      style={{ position: 'absolute', left: -10000, width: 1, height: 1, overflow: 'hidden' }}
    />
  );
}
