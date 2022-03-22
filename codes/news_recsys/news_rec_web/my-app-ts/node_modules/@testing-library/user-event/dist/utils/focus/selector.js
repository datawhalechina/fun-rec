"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FOCUSABLE_SELECTOR = void 0;
const FOCUSABLE_SELECTOR = ['input:not([type=hidden]):not([disabled])', 'button:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', '[contenteditable=""]', '[contenteditable="true"]', 'a[href]', '[tabindex]:not([disabled])'].join(', ');
exports.FOCUSABLE_SELECTOR = FOCUSABLE_SELECTOR;