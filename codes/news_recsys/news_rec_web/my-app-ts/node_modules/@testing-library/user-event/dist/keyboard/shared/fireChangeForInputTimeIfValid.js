"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fireChangeForInputTimeIfValid = fireChangeForInputTimeIfValid;

var _dom = require("@testing-library/dom");

var _utils = require("../../utils");

function fireChangeForInputTimeIfValid(el, prevValue, timeNewEntry) {
  if ((0, _utils.isValidInputTimeValue)(el, timeNewEntry) && prevValue !== timeNewEntry) {
    _dom.fireEvent.change(el, {
      target: {
        value: timeNewEntry
      }
    });
  }
}