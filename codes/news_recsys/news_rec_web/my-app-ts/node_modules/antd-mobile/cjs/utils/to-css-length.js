"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toCSSLength = toCSSLength;

function toCSSLength(val) {
  return typeof val === 'number' ? `${val}px` : val;
}