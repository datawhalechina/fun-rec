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

var resize_observer_polyfill_1 = __importDefault(require("resize-observer-polyfill"));

var useRafState_1 = __importDefault(require("../useRafState"));

var domTarget_1 = require("../utils/domTarget");

var useIsomorphicLayoutEffectWithTarget_1 = __importDefault(require("../utils/useIsomorphicLayoutEffectWithTarget"));

function useSize(target) {
  var _a = __read(useRafState_1["default"](), 2),
      state = _a[0],
      setState = _a[1];

  useIsomorphicLayoutEffectWithTarget_1["default"](function () {
    var el = domTarget_1.getTargetElement(target);

    if (!el) {
      return;
    }

    var resizeObserver = new resize_observer_polyfill_1["default"](function (entries) {
      entries.forEach(function (entry) {
        var _a = entry.target,
            clientWidth = _a.clientWidth,
            clientHeight = _a.clientHeight;
        setState({
          width: clientWidth,
          height: clientHeight
        });
      });
    });
    resizeObserver.observe(el);
    return function () {
      resizeObserver.disconnect();
    };
  }, [], target);
  return state;
}

exports["default"] = useSize;