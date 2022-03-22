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

var useUnmount_1 = __importDefault(require("../useUnmount"));

var isBrowser_1 = __importDefault(require("../utils/isBrowser"));

var DEFAULT_OPTIONS = {
  restoreOnUnmount: false
};

function useTitle(title, options) {
  if (options === void 0) {
    options = DEFAULT_OPTIONS;
  }

  var titleRef = react_1.useRef(isBrowser_1["default"] ? document.title : '');
  react_1.useEffect(function () {
    document.title = title;
  }, [title]);
  useUnmount_1["default"](function () {
    if (options.restoreOnUnmount) {
      document.title = titleRef.current;
    }
  });
}

exports["default"] = useTitle;