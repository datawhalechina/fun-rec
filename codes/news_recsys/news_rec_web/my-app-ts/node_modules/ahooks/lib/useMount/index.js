"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var useMount = function useMount(fn) {
  if (process.env.NODE_ENV === 'development') {
    if (typeof fn !== 'function') {
      console.error("useMount: parameter `fn` expected to be a function, but got \"" + typeof fn + "\".");
    }
  }

  react_1.useEffect(function () {
    fn === null || fn === void 0 ? void 0 : fn();
  }, []);
};

exports["default"] = useMount;