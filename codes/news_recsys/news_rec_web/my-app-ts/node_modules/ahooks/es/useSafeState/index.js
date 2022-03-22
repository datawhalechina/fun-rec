var __read = this && this.__read || function (o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) {
      ar.push(r.value);
    }
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
};

import { useCallback, useState } from 'react';
import useUnmountedRef from '../useUnmountedRef';

function useSafeState(initialState) {
  var unmountedRef = useUnmountedRef();

  var _a = __read(useState(initialState), 2),
      state = _a[0],
      setState = _a[1];

  var setCurrentState = useCallback(function (currentState) {
    /** if component is unmounted, stop update */
    if (unmountedRef.current) return;
    setState(currentState);
  }, []);
  return [state, setCurrentState];
}

export default useSafeState;