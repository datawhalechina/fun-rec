import { useRef } from 'react';

function useLatest(value) {
  var ref = useRef(value);
  ref.current = value;
  return ref;
}

export default useLatest;