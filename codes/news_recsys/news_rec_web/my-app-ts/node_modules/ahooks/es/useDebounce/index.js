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

import { useEffect, useState } from 'react';
import useDebounceFn from '../useDebounceFn';

function useDebounce(value, options) {
  var _a = __read(useState(value), 2),
      debounced = _a[0],
      setDebounced = _a[1];

  var run = useDebounceFn(function () {
    setDebounced(value);
  }, options).run;
  useEffect(function () {
    run();
  }, [value]);
  return debounced;
}

export default useDebounce;