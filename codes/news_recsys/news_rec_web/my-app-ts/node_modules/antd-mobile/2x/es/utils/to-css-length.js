export function toCSSLength(val) {
  return typeof val === 'number' ? `${val}px` : val;
}