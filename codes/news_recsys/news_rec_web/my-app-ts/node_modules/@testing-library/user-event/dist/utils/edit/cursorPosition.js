"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isCursorAtEnd = isCursorAtEnd;
exports.isCursorAtStart = isCursorAtStart;

var _selectionRange = require("./selectionRange");

var _getValue2 = require("./getValue");

function isCursorAtEnd(element) {
  var _getValue;

  const {
    selectionStart,
    selectionEnd
  } = (0, _selectionRange.getSelectionRange)(element);
  return selectionStart === selectionEnd && (selectionStart != null ? selectionStart :
  /* istanbul ignore next */
  0) === ((_getValue = (0, _getValue2.getValue)(element)) != null ? _getValue :
  /* istanbul ignore next */
  '').length;
}

function isCursorAtStart(element) {
  const {
    selectionStart,
    selectionEnd
  } = (0, _selectionRange.getSelectionRange)(element);
  return selectionStart === selectionEnd && (selectionStart != null ? selectionStart :
  /* istanbul ignore next */
  0) === 0;
}