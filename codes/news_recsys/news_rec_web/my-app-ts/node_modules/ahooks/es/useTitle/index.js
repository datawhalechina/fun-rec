import { useEffect, useRef } from 'react';
import useUnmount from '../useUnmount';
import isBrowser from '../utils/isBrowser';
var DEFAULT_OPTIONS = {
  restoreOnUnmount: false
};

function useTitle(title, options) {
  if (options === void 0) {
    options = DEFAULT_OPTIONS;
  }

  var titleRef = useRef(isBrowser ? document.title : '');
  useEffect(function () {
    document.title = title;
  }, [title]);
  useUnmount(function () {
    if (options.restoreOnUnmount) {
      document.title = titleRef.current;
    }
  });
}

export default useTitle;