import { useRef } from 'react';
import useUpdateEffect from '../../../useUpdateEffect';
import isDocumentVisible from '../utils/isDocumentVisible';
import subscribeReVisible from '../utils/subscribeReVisible';

var usePollingPlugin = function usePollingPlugin(fetchInstance, _a) {
  var pollingInterval = _a.pollingInterval,
      _b = _a.pollingWhenHidden,
      pollingWhenHidden = _b === void 0 ? true : _b;
  var timerRef = useRef();
  var unsubscribeRef = useRef();

  var stopPolling = function stopPolling() {
    var _a;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    (_a = unsubscribeRef.current) === null || _a === void 0 ? void 0 : _a.call(unsubscribeRef);
  };

  useUpdateEffect(function () {
    if (!pollingInterval) {
      stopPolling();
    }
  }, [pollingInterval]);

  if (!pollingInterval) {
    return {};
  }

  return {
    onBefore: function onBefore() {
      stopPolling();
    },
    onFinally: function onFinally() {
      // if pollingWhenHidden = false && document is hidden, then stop polling and subscribe revisible
      if (!pollingWhenHidden && !isDocumentVisible()) {
        unsubscribeRef.current = subscribeReVisible(function () {
          fetchInstance.refresh();
        });
        return;
      }

      timerRef.current = setTimeout(function () {
        fetchInstance.refresh();
      }, pollingInterval);
    },
    onCancel: function onCancel() {
      stopPolling();
    }
  };
};

export default usePollingPlugin;