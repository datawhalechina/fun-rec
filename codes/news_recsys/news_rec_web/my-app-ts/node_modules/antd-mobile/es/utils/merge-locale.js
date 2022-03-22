import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
export function mergeLocale(base, patch) {
  return merge(cloneDeep(base), patch);
}