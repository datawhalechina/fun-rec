var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

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
import { isFunction } from '../utils';

var useSetState = function useSetState(initialState) {
  var _a = __read(useState(initialState), 2),
      state = _a[0],
      setState = _a[1];

  var setMergeState = useCallback(function (patch) {
    setState(function (prevState) {
      var newState = isFunction(patch) ? patch(prevState) : patch;
      return newState ? __assign(__assign({}, prevState), newState) : prevState;
    });
  }, []);
  return [state, setMergeState];
};

export default useSetState;