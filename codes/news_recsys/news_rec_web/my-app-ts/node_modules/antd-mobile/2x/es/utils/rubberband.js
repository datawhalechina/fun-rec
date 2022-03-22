import { bound } from './bound';
export function rubberband(distance, dimension, constant) {
  return distance * dimension * constant / (dimension + constant * distance);
}
export function rubberbandIfOutOfBounds(position, min, max, dimension, constant = 0.15) {
  if (constant === 0) return bound(position, min, max);
  if (position < min) return -rubberband(min - position, dimension, constant) + min;
  if (position > max) return +rubberband(position - max, dimension, constant) + max;
  return position;
}