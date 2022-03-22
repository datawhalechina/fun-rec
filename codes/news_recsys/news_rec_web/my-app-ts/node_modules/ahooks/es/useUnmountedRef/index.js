import { useEffect, useRef } from 'react';

var useUnmountedRef = function useUnmountedRef() {
  var unmountedRef = useRef(false);
  useEffect(function () {
    unmountedRef.current = false;
    return function () {
      unmountedRef.current = true;
    };
  }, []);
  return unmountedRef;
};

export default useUnmountedRef;