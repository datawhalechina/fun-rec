"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasPointerEvents = hasPointerEvents;

var _helpers = require("@testing-library/dom/dist/helpers");

function hasPointerEvents(element) {
  const window = (0, _helpers.getWindowFromNode)(element);

  for (let el = element; (_el = el) != null && _el.ownerDocument; el = el.parentElement) {
    var _el;

    const pointerEvents = window.getComputedStyle(el).pointerEvents;

    if (pointerEvents && !['inherit', 'unset'].includes(pointerEvents)) {
      return pointerEvents !== 'none';
    }
  }

  return true;
}