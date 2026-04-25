import { useEffect, useState } from 'react';

function readInitial(): boolean {
  if (typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(readInitial);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent): void => { setReduced(e.matches); };
    mql.addEventListener('change', onChange);
    return (): void => { mql.removeEventListener('change', onChange); };
  }, []);
  return reduced;
}
