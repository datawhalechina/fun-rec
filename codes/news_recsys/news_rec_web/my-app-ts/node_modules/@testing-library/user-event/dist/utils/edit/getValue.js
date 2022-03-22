"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getValue = getValue;

var _isContentEditable = require("./isContentEditable");

function getValue(element) {
  // istanbul ignore if
  if (!element) {
    return null;
  }

  if ((0, _isContentEditable.isContentEditable)(element)) {
    return element.textContent;
  }

  return element.value;
}