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

var useUnmount_1 = __importDefault(require("../../../useUnmount"));

var limit_1 = __importDefault(require("../utils/limit"));

var subscribeFocus_1 = __importDefault(require("../utils/subscribeFocus"));

var useRefreshOnWindowFocusPlugin = function useRefreshOnWindowFocusPlugin(fetchInstance, _a) {
  var refreshOnWindowFocus = _a.refreshOnWindowFocus,
      _b = _a.focusTimespan,
      focusTimespan = _b === void 0 ? 5000 : _b;
  var unsubscribeRef = react_1.useRef();

  var stopSubscribe = function stopSubscribe() {
    var _a;

    (_a = unsubscribeRef.current) === null || _a === void 0 ? void 0 : _a.call(unsubscribeRef);
  };

  react_1.useEffect(function () {
    if (refreshOnWindowFocus) {
      var limitRefresh_1 = limit_1["default"](fetchInstance.refresh.bind(fetchInstance), focusTimespan);
      unsubscribeRef.current = subscribeFocus_1["default"](function () {
        limitRefresh_1();
      });
    }

    return function () {
      stopSubscribe();
    };
  }, [refreshOnWindowFocus, focusTimespan]);
  useUnmount_1["default"](function () {
    stopSubscribe();
  });
  return {};
};

exports["default"] = useRefreshOnWindowFocusPlugin;