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

import debounce from 'lodash/debounce';
import { useMemo } from 'react';
import useLatest from '../useLatest';
import useUnmount from '../useUnmount';

function useDebounceFn(fn, options) {
  var _a;

  if (process.env.NODE_ENV === 'development') {
    if (typeof fn !== 'function') {
      console.error("useDebounceFn expected parameter is a function, got " + typeof fn);
    }
  }

  var fnRef = useLatest(fn);
  var wait = (_a = options === null || options === void 0 ? void 0 : options.wait) !== null && _a !== void 0 ? _a : 1000;
  var debounced = useMemo(function () {
    return debounce(function () {
      var args = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }

      return fnRef.current.apply(fnRef, __spread(args));
    }, wait, options);
  }, []);
  useUnmount(function () {
    debounced.cancel();
  });
  return {
    run: debounced,
    cancel: debounced.cancel,
    flush: debounced.flush
  };
}

export default useDebounceFn;