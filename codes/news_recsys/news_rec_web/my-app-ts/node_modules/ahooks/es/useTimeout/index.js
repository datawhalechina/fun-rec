import { useEffect } from 'react';
import useLatest from '../useLatest';

function useTimeout(fn, delay) {
  var fnRef = useLatest(fn);
  useEffect(function () {
    if (typeof delay !== 'number' || delay < 0) return;
    var timer = setTimeout(function () {
      fnRef.current();
    }, delay);
    return function () {
      clearTimeout(timer);
    };
  }, [delay]);
}

export default useTimeout;