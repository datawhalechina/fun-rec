"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var useLatest_1 = __importDefault(require("../useLatest"));

var domTarget_1 = require("../utils/domTarget");

var useEffectWithTarget_1 = __importDefault(require("../utils/useEffectWithTarget"));

function useEventListener(eventName, handler, options) {
  if (options === void 0) {
    options = {};
  }

  var handlerRef = useLatest_1["default"](handler);
  useEffectWithTarget_1["default"](function () {
    var targetElement = domTarget_1.getTargetElement(options.target, window);

    if (!(targetElement === null || targetElement === void 0 ? void 0 : targetElement.addEventListener)) {
      return;
    }

    var eventListener = function eventListener(event) {
      return handlerRef.current(event);
    };

    targetElement.addEventListener(eventName, eventListener, {
      capture: options.capture,
      once: options.once,
      passive: options.passive
    });
    return function () {
      targetElement.removeEventListener(eventName, eventListener, {
        capture: options.capture
      });
    };
  }, [eventName, options.capture, options.once, options.passive], options.target);
}

exports["default"] = useEventListener;