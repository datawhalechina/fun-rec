"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAndroid = isAndroid;
exports.isDate = isDate;
exports.isDef = isDef;
exports.isIOS = isIOS;
exports.isMobile = isMobile;
exports.isNumeric = isNumeric;
exports.isObject = isObject;
exports.isPromise = isPromise;

var _canUseDom = require("./can-use-dom");

function isDef(val) {
  return val !== undefined && val !== null;
}

function isObject(val) {
  return val !== null && typeof val === 'object';
}

function isPromise(obj) {
  return !!obj && typeof obj === 'object' && typeof obj.then === 'function';
}

function isDate(val) {
  return Object.prototype.toString.call(val) === '[object Date]' && !Number.isNaN(val.getTime());
}

function isMobile(value) {
  value = value.replace(/[^-|\d]/g, '');
  return /^((\+86)|(86))?(1)\d{10}$/.test(value) || /^0[0-9-]{10,13}$/.test(value);
}

function isNumeric(val) {
  return typeof val === 'number' || /^\d+(\.\d+)?$/.test(val);
}

function isAndroid() {
  return _canUseDom.canUseDom ? /android/.test(navigator.userAgent.toLowerCase()) : false;
}

function isIOS() {
  return _canUseDom.canUseDom ? /ios|iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) : false;
}