"use strict";

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

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var throttle_1 = __importDefault(require("lodash/throttle"));

var react_1 = require("react");

var useThrottlePlugin = function useThrottlePlugin(fetchInstance, _a) {
  var throttleWait = _a.throttleWait,
      throttleLeading = _a.throttleLeading,
      throttleTrailing = _a.throttleTrailing;
  var throttledRef = react_1.useRef();
  var options = {};

  if (throttleLeading !== undefined) {
    options.leading = throttleLeading;
  }

  if (throttleTrailing !== undefined) {
    options.trailing = throttleTrailing;
  }

  react_1.useEffect(function () {
    if (throttleWait) {
      var _originRunAsync_1 = fetchInstance.runAsync.bind(fetchInstance);

      throttledRef.current = throttle_1["default"](function (callback) {
        callback();
      }, throttleWait, options); // throttle runAsync should be promise
      // https://github.com/lodash/lodash/issues/4400#issuecomment-834800398

      fetchInstance.runAsync = function () {
        var args = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }

        return new Promise(function (resolve, reject) {
          var _a;

          (_a = throttledRef.current) === null || _a === void 0 ? void 0 : _a.call(throttledRef, function () {
            _originRunAsync_1.apply(void 0, __spread(args)).then(resolve)["catch"](reject);
          });
        });
      };

      return function () {
        var _a;

        fetchInstance.runAsync = _originRunAsync_1;
        (_a = throttledRef.current) === null || _a === void 0 ? void 0 : _a.cancel();
      };
    }
  }, [throttleWait, throttleLeading, throttleTrailing]);

  if (!throttleWait) {
    return {};
  }

  return {
    onCancel: function onCancel() {
      var _a;

      (_a = throttledRef.current) === null || _a === void 0 ? void 0 : _a.cancel();
    }
  };
};

exports["default"] = useThrottlePlugin;