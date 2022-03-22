"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUpdateEffect = void 0;

var react_1 = require("react");

exports.createUpdateEffect = function (hook) {
  return function (effect, deps) {
    var isMounted = react_1.useRef(false); // for react-refresh

    hook(function () {
      return function () {
        isMounted.current = false;
      };
    }, []);
    hook(function () {
      if (!isMounted.current) {
        isMounted.current = true;
      } else {
        return effect();
      }
    }, deps);
  };
};