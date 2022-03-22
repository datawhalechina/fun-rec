"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var useLoadingDelayPlugin = function useLoadingDelayPlugin(fetchInstance, _a) {
  var loadingDelay = _a.loadingDelay;
  var timerRef = react_1.useRef();

  if (!loadingDelay) {
    return {};
  }

  var cancelTimeout = function cancelTimeout() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  return {
    onBefore: function onBefore() {
      cancelTimeout();
      timerRef.current = setTimeout(function () {
        fetchInstance.setState({
          loading: true
        });
      }, loadingDelay);
      return {
        loading: false
      };
    },
    onFinally: function onFinally() {
      cancelTimeout();
    },
    onCancel: function onCancel() {
      cancelTimeout();
    }
  };
};

exports["default"] = useLoadingDelayPlugin;