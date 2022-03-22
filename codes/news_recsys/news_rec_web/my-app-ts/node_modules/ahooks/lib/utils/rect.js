"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClientHeight = exports.getScrollHeight = exports.getScrollTop = void 0;

var getScrollTop = function getScrollTop(el) {
  if (el === document || el === document.body) {
    return Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
  }

  return el.scrollTop;
};

exports.getScrollTop = getScrollTop;

var getScrollHeight = function getScrollHeight(el) {
  return el.scrollHeight || Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
};

exports.getScrollHeight = getScrollHeight;

var getClientHeight = function getClientHeight(el) {
  return el.clientHeight || Math.max(document.documentElement.clientHeight, document.body.clientHeight);
};

exports.getClientHeight = getClientHeight;