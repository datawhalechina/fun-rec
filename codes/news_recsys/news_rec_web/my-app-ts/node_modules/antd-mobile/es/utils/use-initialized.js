import { useRef } from 'react';
export function useInitialized(check) {
  const initializedRef = useRef(check);

  if (check) {
    initializedRef.current = true;
  }

  return !!initializedRef.current;
}