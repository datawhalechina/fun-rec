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
import { useEffect, useMemo, useRef } from 'react';

var useDebouncePlugin = function useDebouncePlugin(fetchInstance, _a) {
  var debounceWait = _a.debounceWait,
      debounceLeading = _a.debounceLeading,
      debounceTrailing = _a.debounceTrailing,
      debounceMaxWait = _a.debounceMaxWait;
  var debouncedRef = useRef();
  var options = useMemo(function () {
    var ret = {};

    if (debounceLeading !== undefined) {
      ret.leading = debounceLeading;
    }

    if (debounceTrailing !== undefined) {
      ret.trailing = debounceTrailing;
    }

    if (debounceMaxWait !== undefined) {
      ret.maxWait = debounceMaxWait;
    }

    return ret;
  }, [debounceLeading, debounceTrailing, debounceMaxWait]);
  useEffect(function () {
    if (debounceWait) {
      var _originRunAsync_1 = fetchInstance.runAsync.bind(fetchInstance);

      debouncedRef.current = debounce(function (callback) {
        callback();
      }, debounceWait, options); // debounce runAsync should be promise
      // https://github.com/lodash/lodash/issues/4400#issuecomment-834800398

      fetchInstance.runAsync = function () {
        var args = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }

        return new Promise(function (resolve, reject) {
          var _a;

          (_a = debouncedRef.current) === null || _a === void 0 ? void 0 : _a.call(debouncedRef, function () {
            _originRunAsync_1.apply(void 0, __spread(args)).then(resolve)["catch"](reject);
          });
        });
      };

      return function () {
        var _a;

        (_a = debouncedRef.current) === null || _a === void 0 ? void 0 : _a.cancel();
        fetchInstance.runAsync = _originRunAsync_1;
      };
    }
  }, [debounceWait, options]);

  if (!debounceWait) {
    return {};
  }

  return {
    onCancel: function onCancel() {
      var _a;

      (_a = debouncedRef.current) === null || _a === void 0 ? void 0 : _a.cancel();
    }
  };
};

export default useDebouncePlugin;