"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidInputTimeValue = isValidInputTimeValue;

function isValidInputTimeValue(element, timeValue) {
  const clone = element.cloneNode();
  clone.value = timeValue;
  return clone.value === timeValue;
}