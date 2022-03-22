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

var __spread = this && this.__spread || function () {
  for (var ar = [], i = 0; i < arguments.length; i++) {
    ar = ar.concat(__read(arguments[i]));
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

var useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));

var useUpdate_1 = __importDefault(require("../useUpdate"));

function useControllableValue(props, options) {
  if (props === void 0) {
    props = {};
  }

  if (options === void 0) {
    options = {};
  }

  var defaultValue = options.defaultValue,
      _a = options.defaultValuePropName,
      defaultValuePropName = _a === void 0 ? 'defaultValue' : _a,
      _b = options.valuePropName,
      valuePropName = _b === void 0 ? 'value' : _b,
      _c = options.trigger,
      trigger = _c === void 0 ? 'onChange' : _c;
  var value = props[valuePropName];
  var isControlled = (valuePropName in props);
  var initialValue = react_1.useMemo(function () {
    if (isControlled) {
      return value;
    }

    if (defaultValuePropName in props) {
      return props[defaultValuePropName];
    }

    return defaultValue;
  }, []);
  var stateRef = react_1.useRef(initialValue);

  if (isControlled) {
    stateRef.current = value;
  }

  var update = useUpdate_1["default"]();

  var setState = function setState(v) {
    var args = [];

    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }

    if (!isControlled) {
      stateRef.current = v;
      update();
    }

    if (props[trigger]) {
      props[trigger].apply(props, __spread([v], args));
    }
  };

  return [stateRef.current, useMemoizedFn_1["default"](setState)];
}

exports["default"] = useControllableValue;