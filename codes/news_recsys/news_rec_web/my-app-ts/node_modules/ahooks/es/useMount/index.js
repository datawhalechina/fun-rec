import { useEffect } from 'react';

var useMount = function useMount(fn) {
  if (process.env.NODE_ENV === 'development') {
    if (typeof fn !== 'function') {
      console.error("useMount: parameter `fn` expected to be a function, but got \"" + typeof fn + "\".");
    }
  }

  useEffect(function () {
    fn === null || fn === void 0 ? void 0 : fn();
  }, []);
};

export default useMount;