"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDisabled = isDisabled;

// This should probably be extended with checking the element type
// https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled
function isDisabled(element) {
  return Boolean(element && element.disabled);
}