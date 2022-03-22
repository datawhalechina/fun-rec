"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var useLatest_1 = __importDefault(require("../useLatest"));

var useUnmount = function useUnmount(fn) {
  if (process.env.NODE_ENV === 'development') {
    if (typeof fn !== 'function') {
      console.error("useUnmount expected parameter is a function, got " + typeof fn);
    }
  }

  var fnRef = useLatest_1["default"](fn);
  react_1.useEffect(function () {
    return function () {
      fnRef.current();
    };
  }, []);
};

exports["default"] = useUnmount;