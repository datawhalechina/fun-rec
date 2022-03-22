"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasFormSubmit = void 0;

const hasFormSubmit = form => !!(form && (form.querySelector('input[type="submit"]') || form.querySelector('button[type="submit"]')));

exports.hasFormSubmit = hasFormSubmit;