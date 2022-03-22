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

var useToggle_1 = __importDefault(require("../useToggle"));

function useBoolean(defaultValue) {
  if (defaultValue === void 0) {
    defaultValue = false;
  }

  var _a = __read(useToggle_1["default"](defaultValue), 2),
      state = _a[0],
      _b = _a[1],
      toggle = _b.toggle,
      _set = _b.set;

  var actions = react_1.useMemo(function () {
    var setTrue = function setTrue() {
      return _set(true);
    };

    var setFalse = function setFalse() {
      return _set(false);
    };

    return {
      toggle: toggle,
      set: function set(v) {
        return _set(!!v);
      },
      setTrue: setTrue,
      setFalse: setFalse
    };
  }, []);
  return [state, actions];
}

exports["default"] = useBoolean;