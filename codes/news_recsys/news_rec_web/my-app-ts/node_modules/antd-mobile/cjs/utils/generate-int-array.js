"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateIntArray = generateIntArray;

function generateIntArray(from, to) {
  const array = [];

  for (let i = from; i <= to; i++) {
    array.push(i);
  }

  return array;
}