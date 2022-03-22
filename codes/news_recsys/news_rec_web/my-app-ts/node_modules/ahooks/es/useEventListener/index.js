import useLatest from '../useLatest';
import { getTargetElement } from '../utils/domTarget';
import useEffectWithTarget from '../utils/useEffectWithTarget';

function useEventListener(eventName, handler, options) {
  if (options === void 0) {
    options = {};
  }

  var handlerRef = useLatest(handler);
  useEffectWithTarget(function () {
    var targetElement = getTargetElement(options.target, window);

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

export default useEventListener;