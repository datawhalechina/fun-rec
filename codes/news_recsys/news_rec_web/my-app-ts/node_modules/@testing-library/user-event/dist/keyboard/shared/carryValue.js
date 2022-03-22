"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.carryValue = carryValue;

var _utils = require("../../utils");

function carryValue(element, state, newValue) {
  const value = (0, _utils.getValue)(element);
  state.carryValue = value !== newValue && value === '' && (0, _utils.hasUnreliableEmptyValue)(element) ? newValue : undefined;
}