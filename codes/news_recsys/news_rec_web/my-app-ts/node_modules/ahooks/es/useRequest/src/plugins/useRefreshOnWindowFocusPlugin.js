import { useEffect, useRef } from 'react';
import useUnmount from '../../../useUnmount';
import limit from '../utils/limit';
import subscribeFocus from '../utils/subscribeFocus';

var useRefreshOnWindowFocusPlugin = function useRefreshOnWindowFocusPlugin(fetchInstance, _a) {
  var refreshOnWindowFocus = _a.refreshOnWindowFocus,
      _b = _a.focusTimespan,
      focusTimespan = _b === void 0 ? 5000 : _b;
  var unsubscribeRef = useRef();

  var stopSubscribe = function stopSubscribe() {
    var _a;

    (_a = unsubscribeRef.current) === null || _a === void 0 ? void 0 : _a.call(unsubscribeRef);
  };

  useEffect(function () {
    if (refreshOnWindowFocus) {
      var limitRefresh_1 = limit(fetchInstance.refresh.bind(fetchInstance), focusTimespan);
      unsubscribeRef.current = subscribeFocus(function () {
        limitRefresh_1();
      });
    }

    return function () {
      stopSubscribe();
    };
  }, [refreshOnWindowFocus, focusTimespan]);
  useUnmount(function () {
    stopSubscribe();
  });
  return {};
};

export default useRefreshOnWindowFocusPlugin;