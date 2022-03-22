import { useEffect, useRef, useState } from 'react';
export function useRefState(initialState) {
  const [state, setState] = useState(initialState);
  const ref = useRef(state);
  useEffect(() => {
    ref.current = state;
  }, [state]);
  return [state, setState, ref];
}