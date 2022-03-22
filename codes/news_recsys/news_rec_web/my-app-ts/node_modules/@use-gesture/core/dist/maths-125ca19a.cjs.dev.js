'use strict';

function clamp(v, min, max) {
  return Math.max(min, Math.min(v, max));
}
const V = {
  toVector(v, fallback) {
    if (v === undefined) v = fallback;
    return Array.isArray(v) ? v : [v, v];
  },

  add(v1, v2) {
    return [v1[0] + v2[0], v1[1] + v2[1]];
  },

  sub(v1, v2) {
    return [v1[0] - v2[0], v1[1] - v2[1]];
  },

  addTo(v1, v2) {
    v1[0] += v2[0];
    v1[1] += v2[1];
  },

  subTo(v1, v2) {
    v1[0] -= v2[0];
    v1[1] -= v2[1];
  }

};

function rubberband(distance, dimension, constant) {
  if (dimension === 0 || Math.abs(dimension) === Infinity) return Math.pow(distance, constant * 5);
  return distance * dimension * constant / (dimension + constant * distance);
}

function rubberbandIfOutOfBounds(position, min, max, constant = 0.15) {
  if (constant === 0) return clamp(position, min, max);
  if (position < min) return -rubberband(min - position, max - min, constant) + min;
  if (position > max) return +rubberband(position - max, max - min, constant) + max;
  return position;
}
function computeRubberband(bounds, [Vx, Vy], [Rx, Ry]) {
  const [[X0, X1], [Y0, Y1]] = bounds;
  return [rubberbandIfOutOfBounds(Vx, X0, X1, Rx), rubberbandIfOutOfBounds(Vy, Y0, Y1, Ry)];
}

exports.V = V;
exports.computeRubberband = computeRubberband;
exports.rubberbandIfOutOfBounds = rubberbandIfOutOfBounds;
