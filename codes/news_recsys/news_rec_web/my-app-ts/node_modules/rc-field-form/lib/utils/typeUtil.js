"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toArray = toArray;

function toArray(value) {
  if (value === undefined || value === null) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}