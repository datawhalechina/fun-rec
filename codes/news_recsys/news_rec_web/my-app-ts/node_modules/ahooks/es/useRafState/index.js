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

import { useCallback, useRef, useState } from 'react';
import useUnmount from '../useUnmount';

function useRafState(initialState) {
  var ref = useRef(0);

  var _a = __read(useState(initialState), 2),
      state = _a[0],
      setState = _a[1];

  var setRafState = useCallback(function (value) {
    cancelAnimationFrame(ref.current);
    ref.current = requestAnimationFrame(function () {
      setState(value);
    });
  }, []);
  useUnmount(function () {
    cancelAnimationFrame(ref.current);
  });
  return [state, setRafState];
}

export default useRafState;