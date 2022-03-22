import { canUseDom } from './can-use-dom';
export function isDef(val) {
  return val !== undefined && val !== null;
}
export function isObject(val) {
  return val !== null && typeof val === 'object';
}
export function isPromise(obj) {
  return !!obj && typeof obj === 'object' && typeof obj.then === 'function';
}
export function isDate(val) {
  return Object.prototype.toString.call(val) === '[object Date]' && !Number.isNaN(val.getTime());
}
export function isMobile(value) {
  value = value.replace(/[^-|\d]/g, '');
  return /^((\+86)|(86))?(1)\d{10}$/.test(value) || /^0[0-9-]{10,13}$/.test(value);
}
export function isNumeric(val) {
  return typeof val === 'number' || /^\d+(\.\d+)?$/.test(val);
}
export function isAndroid() {
  return canUseDom ? /android/.test(navigator.userAgent.toLowerCase()) : false;
}
export function isIOS() {
  return canUseDom ? /ios|iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) : false;
}