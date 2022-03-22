"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isClickableInput = isClickableInput;

var _isElementType = require("../misc/isElementType");

const CLICKABLE_INPUT_TYPES = ['button', 'color', 'file', 'image', 'reset', 'submit', 'checkbox', 'radio'];

function isClickableInput(element) {
  return (0, _isElementType.isElementType)(element, 'button') || (0, _isElementType.isElementType)(element, 'input') && CLICKABLE_INPUT_TYPES.includes(element.type);
}