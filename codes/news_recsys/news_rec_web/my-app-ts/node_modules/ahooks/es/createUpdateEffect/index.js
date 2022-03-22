import { useRef } from 'react';
export var createUpdateEffect = function createUpdateEffect(hook) {
  return function (effect, deps) {
    var isMounted = useRef(false); // for react-refresh

    hook(function () {
      return function () {
        isMounted.current = false;
      };
    }, []);
    hook(function () {
      if (!isMounted.current) {
        isMounted.current = true;
      } else {
        return effect();
      }
    }, deps);
  };
};