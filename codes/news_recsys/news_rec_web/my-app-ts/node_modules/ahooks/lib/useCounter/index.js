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

var useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));

function getTargetValue(val, options) {
  if (options === void 0) {
    options = {};
  }

  var min = options.min,
      max = options.max;
  var target = val;

  if (typeof max === 'number') {
    target = Math.min(max, target);
  }

  if (typeof min === 'number') {
    target = Math.max(min, target);
  }

  return target;
}

function useCounter(initialValue, options) {
  if (initialValue === void 0) {
    initialValue = 0;
  }

  if (options === void 0) {
    options = {};
  }

  var min = options.min,
      max = options.max;

  var _a = __read(react_1.useState(function () {
    return getTargetValue(initialValue, {
      min: min,
      max: max
    });
  }), 2),
      current = _a[0],
      setCurrent = _a[1];

  var setValue = function setValue(value) {
    setCurrent(function (c) {
      var target = typeof value === 'number' ? value : value(c);
      return getTargetValue(target, {
        max: max,
        min: min
      });
    });
  };

  var inc = function inc(delta) {
    if (delta === void 0) {
      delta = 1;
    }

    setValue(function (c) {
      return c + delta;
    });
  };

  var dec = function dec(delta) {
    if (delta === void 0) {
      delta = 1;
    }

    setValue(function (c) {
      return c - delta;
    });
  };

  var set = function set(value) {
    setValue(value);
  };

  var reset = function reset() {
    setValue(initialValue);
  };

  return [current, {
    inc: useMemoizedFn_1["default"](inc),
    dec: useMemoizedFn_1["default"](dec),
    set: useMemoizedFn_1["default"](set),
    reset: useMemoizedFn_1["default"](reset)
  }];
}

exports["default"] = useCounter;