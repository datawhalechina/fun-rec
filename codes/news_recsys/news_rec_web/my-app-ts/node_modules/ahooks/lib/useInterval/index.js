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

function useInterval(fn, delay, options) {
  var immediate = options === null || options === void 0 ? void 0 : options.immediate;
  var fnRef = useLatest_1["default"](fn);
  react_1.useEffect(function () {
    if (typeof delay !== 'number' || delay < 0) return;

    if (immediate) {
      fnRef.current();
    }

    var timer = setInterval(function () {
      fnRef.current();
    }, delay);
    return function () {
      clearInterval(timer);
    };
  }, [delay]);
}

exports["default"] = useInterval;