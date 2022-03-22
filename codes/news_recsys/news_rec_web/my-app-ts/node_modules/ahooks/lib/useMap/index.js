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

function useMap(initialValue) {
  var getInitValue = function getInitValue() {
    return initialValue === undefined ? new Map() : new Map(initialValue);
  };

  var _a = __read(react_1.useState(function () {
    return getInitValue();
  }), 2),
      map = _a[0],
      setMap = _a[1];

  var set = function set(key, entry) {
    setMap(function (prev) {
      var temp = new Map(prev);
      temp.set(key, entry);
      return temp;
    });
  };

  var setAll = function setAll(newMap) {
    setMap(new Map(newMap));
  };

  var remove = function remove(key) {
    setMap(function (prev) {
      var temp = new Map(prev);
      temp["delete"](key);
      return temp;
    });
  };

  var reset = function reset() {
    return setMap(getInitValue());
  };

  var get = function get(key) {
    return map.get(key);
  };

  return [map, {
    set: useMemoizedFn_1["default"](set),
    setAll: useMemoizedFn_1["default"](setAll),
    remove: useMemoizedFn_1["default"](remove),
    reset: useMemoizedFn_1["default"](reset),
    get: useMemoizedFn_1["default"](get)
  }];
}

exports["default"] = useMap;