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
import useLatest from '../useLatest';

function useEventTarget(options) {
  var _a = options || {},
      initialValue = _a.initialValue,
      transformer = _a.transformer;

  var _b = __read(useState(initialValue), 2),
      value = _b[0],
      setValue = _b[1];

  var transformerRef = useLatest(transformer);
  var reset = useCallback(function () {
    return setValue(initialValue);
  }, []);
  var onChange = useCallback(function (e) {
    var _value = e.target.value;

    if (typeof transformerRef.current === 'function') {
      return setValue(transformerRef.current(_value));
    } // no transformer => U and T should be the same


    return setValue(_value);
  }, []);
  return [value, {
    onChange: onChange,
    reset: reset
  }];
}

export default useEventTarget;