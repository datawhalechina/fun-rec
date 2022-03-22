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

var useUnmountedRef_1 = __importDefault(require("../useUnmountedRef"));

function useSafeState(initialState) {
  var unmountedRef = useUnmountedRef_1["default"]();

  var _a = __read(react_1.useState(initialState), 2),
      state = _a[0],
      setState = _a[1];

  var setCurrentState = react_1.useCallback(function (currentState) {
    /** if component is unmounted, stop update */
    if (unmountedRef.current) return;
    setState(currentState);
  }, []);
  return [state, setCurrentState];
}

exports["default"] = useSafeState;