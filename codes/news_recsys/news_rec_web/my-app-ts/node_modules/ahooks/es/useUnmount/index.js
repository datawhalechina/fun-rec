import { useEffect } from 'react';
import useLatest from '../useLatest';

var useUnmount = function useUnmount(fn) {
  if (process.env.NODE_ENV === 'development') {
    if (typeof fn !== 'function') {
      console.error("useUnmount expected parameter is a function, got " + typeof fn);
    }
  }

  var fnRef = useLatest(fn);
  useEffect(function () {
    return function () {
      fnRef.current();
    };
  }, []);
};

export default useUnmount;