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

import useBoolean from '../useBoolean';
import useEventListener from '../useEventListener';
export default (function (target, options) {
  var _a = options || {},
      onEnter = _a.onEnter,
      onLeave = _a.onLeave;

  var _b = __read(useBoolean(false), 2),
      state = _b[0],
      _c = _b[1],
      setTrue = _c.setTrue,
      setFalse = _c.setFalse;

  useEventListener('mouseenter', function () {
    onEnter === null || onEnter === void 0 ? void 0 : onEnter();
    setTrue();
  }, {
    target: target
  });
  useEventListener('mouseleave', function () {
    onLeave === null || onLeave === void 0 ? void 0 : onLeave();
    setFalse();
  }, {
    target: target
  });
  return state;
});