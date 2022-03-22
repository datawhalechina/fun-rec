"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var useLatest_1 = __importDefault(require("../useLatest"));

var domTarget_1 = require("../utils/domTarget");

var isBrowser_1 = __importDefault(require("../utils/isBrowser"));

var useEffectWithTarget_1 = __importDefault(require("../utils/useEffectWithTarget"));

var touchSupported = isBrowser_1["default"] && ( // @ts-ignore
'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch);

function useLongPress(onLongPress, target, _a) {
  var _b = _a === void 0 ? {} : _a,
      _c = _b.delay,
      delay = _c === void 0 ? 300 : _c,
      onClick = _b.onClick,
      onLongPressEnd = _b.onLongPressEnd;

  var onLongPressRef = useLatest_1["default"](onLongPress);
  var onClickRef = useLatest_1["default"](onClick);
  var onLongPressEndRef = useLatest_1["default"](onLongPressEnd);
  var timerRef = react_1.useRef();
  var isTriggeredRef = react_1.useRef(false);
  useEffectWithTarget_1["default"](function () {
    var targetElement = domTarget_1.getTargetElement(target);

    if (!(targetElement === null || targetElement === void 0 ? void 0 : targetElement.addEventListener)) {
      return;
    }

    var onStart = function onStart(event) {
      timerRef.current = setTimeout(function () {
        onLongPressRef.current(event);
        isTriggeredRef.current = true;
      }, delay);
    };

    var onEnd = function onEnd(event, shouldTriggerClick) {
      var _a;

      if (shouldTriggerClick === void 0) {
        shouldTriggerClick = false;
      }

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      if (isTriggeredRef.current) {
        (_a = onLongPressEndRef.current) === null || _a === void 0 ? void 0 : _a.call(onLongPressEndRef, event);
      }

      if (shouldTriggerClick && !isTriggeredRef.current && onClickRef.current) {
        onClickRef.current(event);
      }

      isTriggeredRef.current = false;
    };

    var onEndWithClick = function onEndWithClick(event) {
      return onEnd(event, true);
    };

    if (!touchSupported) {
      targetElement.addEventListener('mousedown', onStart);
      targetElement.addEventListener('mouseup', onEndWithClick);
      targetElement.addEventListener('mouseleave', onEnd);
    } else {
      targetElement.addEventListener('touchstart', onStart);
      targetElement.addEventListener('touchend', onEndWithClick);
    }

    return function () {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        isTriggeredRef.current = false;
      }

      if (!touchSupported) {
        targetElement.removeEventListener('mousedown', onStart);
        targetElement.removeEventListener('mouseup', onEndWithClick);
        targetElement.removeEventListener('mouseleave', onEnd);
      } else {
        targetElement.removeEventListener('touchstart', onStart);
        targetElement.removeEventListener('touchend', onEndWithClick);
      }
    };
  }, [], target);
}

exports["default"] = useLongPress;