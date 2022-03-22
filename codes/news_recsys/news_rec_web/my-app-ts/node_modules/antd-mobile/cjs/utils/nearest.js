"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nearest = nearest;

function nearest(arr, target) {
  return arr.reduce((pre, cur) => {
    return Math.abs(pre - target) < Math.abs(cur - target) ? pre : cur;
  });
}