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

var __spread = this && this.__spread || function () {
  for (var ar = [], i = 0; i < arguments.length; i++) {
    ar = ar.concat(__read(arguments[i]));
  }

  return ar;
};

import throttle from 'lodash/throttle';
import { useMemo } from 'react';
import useLatest from '../useLatest';
import useUnmount from '../useUnmount';

function useThrottleFn(fn, options) {
  var _a;

  if (process.env.NODE_ENV === 'development') {
    if (typeof fn !== 'function') {
      console.error("useThrottleFn expected parameter is a function, got " + typeof fn);
    }
  }

  var fnRef = useLatest(fn);
  var wait = (_a = options === null || options === void 0 ? void 0 : options.wait) !== null && _a !== void 0 ? _a : 1000;
  var throttled = useMemo(function () {
    return throttle(function () {
      var args = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }

      return fnRef.current.apply(fnRef, __spread(args));
    }, wait, options);
  }, []);
  useUnmount(function () {
    throttled.cancel();
  });
  return {
    run: throttled,
    cancel: throttled.cancel,
    flush: throttled.flush
  };
}

export default useThrottleFn;