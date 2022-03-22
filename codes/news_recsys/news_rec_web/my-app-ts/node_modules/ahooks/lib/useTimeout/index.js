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

function useTimeout(fn, delay) {
  var fnRef = useLatest_1["default"](fn);
  react_1.useEffect(function () {
    if (typeof delay !== 'number' || delay < 0) return;
    var timer = setTimeout(function () {
      fnRef.current();
    }, delay);
    return function () {
      clearTimeout(timer);
    };
  }, [delay]);
}

exports["default"] = useTimeout;