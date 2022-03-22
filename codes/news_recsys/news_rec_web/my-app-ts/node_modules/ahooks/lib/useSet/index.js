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

function useSet(initialValue) {
  var getInitValue = function getInitValue() {
    return initialValue === undefined ? new Set() : new Set(initialValue);
  };

  var _a = __read(react_1.useState(function () {
    return getInitValue();
  }), 2),
      set = _a[0],
      setSet = _a[1];

  var add = function add(key) {
    if (set.has(key)) {
      return;
    }

    setSet(function (prevSet) {
      var temp = new Set(prevSet);
      temp.add(key);
      return temp;
    });
  };

  var remove = function remove(key) {
    if (!set.has(key)) {
      return;
    }

    setSet(function (prevSet) {
      var temp = new Set(prevSet);
      temp["delete"](key);
      return temp;
    });
  };

  var reset = function reset() {
    return setSet(getInitValue());
  };

  return [set, {
    add: useMemoizedFn_1["default"](add),
    remove: useMemoizedFn_1["default"](remove),
    reset: useMemoizedFn_1["default"](reset)
  }];
}

exports["default"] = useSet;