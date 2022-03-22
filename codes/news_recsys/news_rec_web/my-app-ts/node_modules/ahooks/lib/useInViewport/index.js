"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

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

var __values = this && this.__values || function (o) {
  var s = typeof Symbol === "function" && Symbol.iterator,
      m = s && o[s],
      i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function next() {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("intersection-observer");

var react_1 = require("react");

var domTarget_1 = require("../utils/domTarget");

var useEffectWithTarget_1 = __importDefault(require("../utils/useEffectWithTarget"));

function useInViewport(target, options) {
  var _a = __read(react_1.useState(), 2),
      state = _a[0],
      setState = _a[1];

  var _b = __read(react_1.useState(), 2),
      ratio = _b[0],
      setRatio = _b[1];

  useEffectWithTarget_1["default"](function () {
    var el = domTarget_1.getTargetElement(target);

    if (!el) {
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      var e_1, _a;

      try {
        for (var entries_1 = __values(entries), entries_1_1 = entries_1.next(); !entries_1_1.done; entries_1_1 = entries_1.next()) {
          var entry = entries_1_1.value;
          setRatio(entry.intersectionRatio);

          if (entry.isIntersecting) {
            setState(true);
          } else {
            setState(false);
          }
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (entries_1_1 && !entries_1_1.done && (_a = entries_1["return"])) _a.call(entries_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    }, __assign(__assign({}, options), {
      root: domTarget_1.getTargetElement(options === null || options === void 0 ? void 0 : options.root)
    }));
    observer.observe(el);
    return function () {
      observer.disconnect();
    };
  }, [], target);
  return [state, ratio];
}

exports["default"] = useInViewport;