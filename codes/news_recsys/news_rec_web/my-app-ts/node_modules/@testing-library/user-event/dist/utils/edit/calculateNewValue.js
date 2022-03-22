"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateNewValue = calculateNewValue;

var _selectionRange = require("./selectionRange");

var _getValue2 = require("./getValue");

var _isValidDateValue = require("./isValidDateValue");

var _isValidInputTimeValue = require("./isValidInputTimeValue");

function calculateNewValue(newEntry, element, value = (() => {
  var _getValue;

  return (_getValue = (0, _getValue2.getValue)(element)) != null ? _getValue :
  /* istanbul ignore next */
  '';
})(), selectionRange = (0, _selectionRange.getSelectionRange)(element), deleteContent) {
  const selectionStart = selectionRange.selectionStart === null ? value.length : selectionRange.selectionStart;
  const selectionEnd = selectionRange.selectionEnd === null ? value.length : selectionRange.selectionEnd;
  const prologEnd = Math.max(0, selectionStart === selectionEnd && deleteContent === 'backward' ? selectionStart - 1 : selectionStart);
  const prolog = value.substring(0, prologEnd);
  const epilogStart = Math.min(value.length, selectionStart === selectionEnd && deleteContent === 'forward' ? selectionEnd + 1 : selectionEnd);
  const epilog = value.substring(epilogStart, value.length);
  let newValue = `${prolog}${newEntry}${epilog}`;
  const newSelectionStart = prologEnd + newEntry.length;

  if (element.type === 'date' && !(0, _isValidDateValue.isValidDateValue)(element, newValue)) {
    newValue = value;
  }

  if (element.type === 'time' && !(0, _isValidInputTimeValue.isValidInputTimeValue)(element, newValue)) {
    if ((0, _isValidInputTimeValue.isValidInputTimeValue)(element, newEntry)) {
      newValue = newEntry;
    } else {
      newValue = value;
    }
  }

  return {
    newValue,
    newSelectionStart
  };
}