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

import { useMemo } from 'react';
import useToggle from '../useToggle';
export default function useBoolean(defaultValue) {
  if (defaultValue === void 0) {
    defaultValue = false;
  }

  var _a = __read(useToggle(defaultValue), 2),
      state = _a[0],
      _b = _a[1],
      toggle = _b.toggle,
      _set = _b.set;

  var actions = useMemo(function () {
    var setTrue = function setTrue() {
      return _set(true);
    };

    var setFalse = function setFalse() {
      return _set(false);
    };

    return {
      toggle: toggle,
      set: function set(v) {
        return _set(!!v);
      },
      setTrue: setTrue,
      setFalse: setFalse
    };
  }, []);
  return [state, actions];
}