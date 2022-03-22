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
import useThrottleFn from '../useThrottleFn';
import useUnmount from '../useUnmount';
import useUpdateEffect from '../useUpdateEffect';

function useThrottleEffect(effect, deps, options) {
  var _a = __read(useState({}), 2),
      flag = _a[0],
      setFlag = _a[1];

  var _b = useThrottleFn(function () {
    setFlag({});
  }, options),
      run = _b.run,
      cancel = _b.cancel;

  useEffect(function () {
    return run();
  }, deps);
  useUnmount(cancel);
  useUpdateEffect(effect, [flag]);
}

export default useThrottleEffect;