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

var useLatest_1 = __importDefault(require("../useLatest"));

var useUnmount_1 = __importDefault(require("../useUnmount"));

function useThrottleFn(fn, options) {
  var _a;

  if (process.env.NODE_ENV === 'development') {
    if (typeof fn !== 'function') {
      console.error("useThrottleFn expected parameter is a function, got " + typeof fn);
    }
  }

  var fnRef = useLatest_1["default"](fn);
  var wait = (_a = options === null || options === void 0 ? void 0 : options.wait) !== null && _a !== void 0 ? _a : 1000;
  var throttled = react_1.useMemo(function () {
    return throttle_1["default"](function () {
      var args = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }

      return fnRef.current.apply(fnRef, __spread(args));
    }, wait, options);
  }, []);
  useUnmount_1["default"](function () {
    throttled.cancel();
  });
  return {
    run: throttled,
    cancel: throttled.cancel,
    flush: throttled.flush
  };
}

exports["default"] = useThrottleFn;