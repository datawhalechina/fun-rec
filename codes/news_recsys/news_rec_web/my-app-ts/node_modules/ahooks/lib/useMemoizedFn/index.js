"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

function useMemoizedFn(fn) {
  if (process.env.NODE_ENV === 'development') {
    if (typeof fn !== 'function') {
      console.error("useMemoizedFn expected parameter is a function, got " + typeof fn);
    }
  }

  var fnRef = react_1.useRef(fn); // why not write `fnRef.current = fn`?
  // https://github.com/alibaba/hooks/issues/728

  fnRef.current = react_1.useMemo(function () {
    return fn;
  }, [fn]);
  var memoizedFn = react_1.useRef();

  if (!memoizedFn.current) {
    memoizedFn.current = function () {
      var args = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }

      return fnRef.current.apply(this, args);
    };
  }

  return memoizedFn.current;
}

exports["default"] = useMemoizedFn;