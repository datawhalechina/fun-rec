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

import ResizeObserver from 'resize-observer-polyfill';
import useRafState from '../useRafState';
import { getTargetElement } from '../utils/domTarget';
import useIsomorphicLayoutEffectWithTarget from '../utils/useIsomorphicLayoutEffectWithTarget';

function useSize(target) {
  var _a = __read(useRafState(), 2),
      state = _a[0],
      setState = _a[1];

  useIsomorphicLayoutEffectWithTarget(function () {
    var el = getTargetElement(target);

    if (!el) {
      return;
    }

    var resizeObserver = new ResizeObserver(function (entries) {
      entries.forEach(function (entry) {
        var _a = entry.target,
            clientWidth = _a.clientWidth,
            clientHeight = _a.clientHeight;
        setState({
          width: clientWidth,
          height: clientHeight
        });
      });
    });
    resizeObserver.observe(el);
    return function () {
      resizeObserver.disconnect();
    };
  }, [], target);
  return state;
}

export default useSize;