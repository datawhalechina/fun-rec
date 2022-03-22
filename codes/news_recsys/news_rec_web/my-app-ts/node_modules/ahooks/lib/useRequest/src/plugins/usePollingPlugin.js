"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var useUpdateEffect_1 = __importDefault(require("../../../useUpdateEffect"));

var isDocumentVisible_1 = __importDefault(require("../utils/isDocumentVisible"));

var subscribeReVisible_1 = __importDefault(require("../utils/subscribeReVisible"));

var usePollingPlugin = function usePollingPlugin(fetchInstance, _a) {
  var pollingInterval = _a.pollingInterval,
      _b = _a.pollingWhenHidden,
      pollingWhenHidden = _b === void 0 ? true : _b;
  var timerRef = react_1.useRef();
  var unsubscribeRef = react_1.useRef();

  var stopPolling = function stopPolling() {
    var _a;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    (_a = unsubscribeRef.current) === null || _a === void 0 ? void 0 : _a.call(unsubscribeRef);
  };

  useUpdateEffect_1["default"](function () {
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
      if (!pollingWhenHidden && !isDocumentVisible_1["default"]()) {
        unsubscribeRef.current = subscribeReVisible_1["default"](function () {
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

exports["default"] = usePollingPlugin;