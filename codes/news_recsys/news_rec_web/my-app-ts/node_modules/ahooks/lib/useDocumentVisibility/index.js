"use strict";

var __read = this && this.__read || function (o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) {
      ar.push(r.value);
    }
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var useEventListener_1 = __importDefault(require("../useEventListener"));

var isBrowser_1 = __importDefault(require("../utils/isBrowser"));

var getVisibility = function getVisibility() {
  if (!isBrowser_1["default"]) {
    return 'visible';
  }

  return document.visibilityState;
};

function useDocumentVisibility() {
  var _a = __read(react_1.useState(function () {
    return getVisibility();
  }), 2),
      documentVisibility = _a[0],
      setDocumentVisibility = _a[1];

  useEventListener_1["default"]('visibilitychange', function () {
    setDocumentVisibility(getVisibility());
  }, {
    target: function target() {
      return document;
    }
  });
  return documentVisibility;
}

exports["default"] = useDocumentVisibility;