const record = {
  'topLeft': 'top-start',
  'topRight': 'top-end',
  'bottomLeft': 'bottom-start',
  'bottomRight': 'bottom-end',
  'leftTop': 'left-start',
  'leftBottom': 'left-end',
  'rightTop': 'right-start',
  'rightBottom': 'right-end'
};
export function normalizePlacement(placement) {
  var _a;

  return (_a = record[placement]) !== null && _a !== void 0 ? _a : placement;
}