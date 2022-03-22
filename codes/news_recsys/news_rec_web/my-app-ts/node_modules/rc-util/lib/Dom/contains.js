"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = contains;

function contains(root, n) {
  if (!root) {
    return false;
  }

  return root.contains(n);
}