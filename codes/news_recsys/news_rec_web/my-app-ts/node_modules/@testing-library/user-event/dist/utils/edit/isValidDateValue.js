"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidDateValue = isValidDateValue;

function isValidDateValue(element, value) {
  const clone = element.cloneNode();
  clone.value = value;
  return clone.value === value;
}