import assign from 'lodash/assign';
import assignWith from 'lodash/assignWith';
import isUndefined from 'lodash/isUndefined';
export function mergeProps(...items) {
  function customizer(objValue, srcValue) {
    return isUndefined(srcValue) ? objValue : srcValue;
  }

  let ret = assign({}, items[0]);

  for (let i = 1; i < items.length; i++) {
    ret = assignWith(ret, items[i], customizer);
  }

  return ret;
}