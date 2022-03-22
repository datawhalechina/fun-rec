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

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var useEventListener_1 = __importDefault(require("../useEventListener"));

function useFocusWithin(target, options) {
  var _a = __read(react_1.useState(false), 2),
      isFocusWithin = _a[0],
      setIsFocusWithin = _a[1];

  var _b = options || {},
      onFocus = _b.onFocus,
      onBlur = _b.onBlur,
      onChange = _b.onChange;

  useEventListener_1["default"]('focusin', function (e) {
    if (!isFocusWithin) {
      onFocus === null || onFocus === void 0 ? void 0 : onFocus(e);
      onChange === null || onChange === void 0 ? void 0 : onChange(true);
      setIsFocusWithin(true);
    }
  }, {
    target: target
  });
  useEventListener_1["default"]('focusout', function (e) {
    var _a, _b; // @ts-ignore


    if (isFocusWithin && !((_b = (_a = e.currentTarget) === null || _a === void 0 ? void 0 : _a.contains) === null || _b === void 0 ? void 0 : _b.call(_a, e.relatedTarget))) {
      onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
      onChange === null || onChange === void 0 ? void 0 : onChange(false);
      setIsFocusWithin(false);
    }
  }, {
    target: target
  });
  return isFocusWithin;
}

exports["default"] = useFocusWithin;