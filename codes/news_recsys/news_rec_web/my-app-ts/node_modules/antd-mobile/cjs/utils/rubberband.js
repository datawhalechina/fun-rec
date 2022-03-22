"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rubberband = rubberband;
exports.rubberbandIfOutOfBounds = rubberbandIfOutOfBounds;

var _bound = require("./bound");

function rubberband(distance, dimension, constant) {
  return distance * dimension * constant / (dimension + constant * distance);
}

function rubberbandIfOutOfBounds(position, min, max, dimension, constant = 0.15) {
  if (constant === 0) return (0, _bound.bound)(position, min, max);
  if (position < min) return -rubberband(min - position, dimension, constant) + min;
  if (position > max) return +rubberband(position - max, dimension, constant) + max;
  return position;
}