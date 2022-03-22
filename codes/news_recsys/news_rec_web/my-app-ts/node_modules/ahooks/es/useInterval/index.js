import { useEffect } from 'react';
import useLatest from '../useLatest';

function useInterval(fn, delay, options) {
  var immediate = options === null || options === void 0 ? void 0 : options.immediate;
  var fnRef = useLatest(fn);
  useEffect(function () {
    if (typeof delay !== 'number' || delay < 0) return;

    if (immediate) {
      fnRef.current();
    }

    var timer = setInterval(function () {
      fnRef.current();
    }, delay);
    return function () {
      clearInterval(timer);
    };
  }, [delay]);
}

export default useInterval;