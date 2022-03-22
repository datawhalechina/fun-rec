"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function canUseDom() {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
}

exports["default"] = canUseDom;