"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isBrowser = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
exports["default"] = isBrowser;