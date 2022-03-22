"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFocusable = isFocusable;

var _isLabelWithInternallyDisabledControl = require("../misc/isLabelWithInternallyDisabledControl");

var _selector = require("./selector");

function isFocusable(element) {
  return !(0, _isLabelWithInternallyDisabledControl.isLabelWithInternallyDisabledControl)(element) && element.matches(_selector.FOCUSABLE_SELECTOR);
}