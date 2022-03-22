"use strict";

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

var __rest = this && this.__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
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

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var js_cookie_1 = __importDefault(require("js-cookie"));

var react_1 = require("react");

var useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));

var utils_1 = require("../utils");

function useCookieState(cookieKey, options) {
  if (options === void 0) {
    options = {};
  }

  var _a = __read(react_1.useState(function () {
    var cookieValue = js_cookie_1["default"].get(cookieKey);
    if (typeof cookieValue === 'string') return cookieValue;

    if (utils_1.isFunction(options.defaultValue)) {
      return options.defaultValue();
    }

    return options.defaultValue;
  }), 2),
      state = _a[0],
      setState = _a[1];

  var updateState = useMemoizedFn_1["default"](function (newValue, newOptions) {
    if (newOptions === void 0) {
      newOptions = {};
    }

    var _a = __assign(__assign({}, options), newOptions),
        defaultValue = _a.defaultValue,
        restOptions = __rest(_a, ["defaultValue"]);

    setState(function (prevState) {
      var value = utils_1.isFunction(newValue) ? newValue(prevState) : newValue;

      if (value === undefined) {
        js_cookie_1["default"].remove(cookieKey);
      } else {
        js_cookie_1["default"].set(cookieKey, value, restOptions);
      }

      return value;
    });
  });
  return [state, updateState];
}

exports["default"] = useCookieState;