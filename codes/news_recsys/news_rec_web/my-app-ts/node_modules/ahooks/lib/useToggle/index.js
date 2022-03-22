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

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

function useToggle(defaultValue, reverseValue) {
  if (defaultValue === void 0) {
    defaultValue = false;
  }

  var _a = __read(react_1.useState(defaultValue), 2),
      state = _a[0],
      setState = _a[1];

  var actions = react_1.useMemo(function () {
    var reverseValueOrigin = reverseValue === undefined ? !defaultValue : reverseValue;

    var toggle = function toggle() {
      return setState(function (s) {
        return s === defaultValue ? reverseValueOrigin : defaultValue;
      });
    };

    var set = function set(value) {
      return setState(value);
    };

    var setLeft = function setLeft() {
      return setState(defaultValue);
    };

    var setRight = function setRight() {
      return setState(reverseValueOrigin);
    };

    return {
      toggle: toggle,
      set: set,
      setLeft: setLeft,
      setRight: setRight
    }; // useToggle ignore value change
    // }, [defaultValue, reverseValue]);
  }, []);
  return [state, actions];
}

exports["default"] = useToggle;