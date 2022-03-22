"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canUseDom = void 0;
const canUseDom = !!(typeof window !== 'undefined' && typeof document !== 'undefined' && window.document && window.document.createElement);
exports.canUseDom = canUseDom;