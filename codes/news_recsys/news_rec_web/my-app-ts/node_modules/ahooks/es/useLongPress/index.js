import { useRef } from 'react';
import useLatest from '../useLatest';
import { getTargetElement } from '../utils/domTarget';
import isBrowser from '../utils/isBrowser';
import useEffectWithTarget from '../utils/useEffectWithTarget';
var touchSupported = isBrowser && ( // @ts-ignore
'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch);

function useLongPress(onLongPress, target, _a) {
  var _b = _a === void 0 ? {} : _a,
      _c = _b.delay,
      delay = _c === void 0 ? 300 : _c,
      onClick = _b.onClick,
      onLongPressEnd = _b.onLongPressEnd;

  var onLongPressRef = useLatest(onLongPress);
  var onClickRef = useLatest(onClick);
  var onLongPressEndRef = useLatest(onLongPressEnd);
  var timerRef = useRef();
  var isTriggeredRef = useRef(false);
  useEffectWithTarget(function () {
    var targetElement = getTargetElement(target);

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

export default useLongPress;