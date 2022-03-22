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

import { useRef } from 'react';
import useUpdateEffect from '../../../useUpdateEffect'; // support refreshDeps & ready

var useAutoRunPlugin = function useAutoRunPlugin(fetchInstance, _a) {
  var manual = _a.manual,
      _b = _a.ready,
      ready = _b === void 0 ? true : _b,
      _c = _a.defaultParams,
      defaultParams = _c === void 0 ? [] : _c,
      _d = _a.refreshDeps,
      refreshDeps = _d === void 0 ? [] : _d,
      refreshDepsAction = _a.refreshDepsAction;
  var hasAutoRun = useRef(false);
  hasAutoRun.current = false;
  useUpdateEffect(function () {
    if (!manual && ready) {
      hasAutoRun.current = true;
      fetchInstance.run.apply(fetchInstance, __spread(defaultParams));
    }
  }, [ready]);
  useUpdateEffect(function () {
    if (hasAutoRun.current) {
      return;
    }

    if (!manual) {
      hasAutoRun.current = true;

      if (refreshDepsAction) {
        refreshDepsAction();
      } else {
        fetchInstance.refresh();
      }
    }
  }, __spread(refreshDeps));
  return {
    onBefore: function onBefore() {
      if (!ready) {
        return {
          stopNow: true
        };
      }
    }
  };
};

useAutoRunPlugin.onInit = function (_a) {
  var _b = _a.ready,
      ready = _b === void 0 ? true : _b,
      manual = _a.manual;
  return {
    loading: !manual && ready
  };
};

export default useAutoRunPlugin;