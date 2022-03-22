"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isVisible = isVisible;

var _helpers = require("@testing-library/dom/dist/helpers");

function isVisible(element) {
  const window = (0, _helpers.getWindowFromNode)(element);

  for (let el = element; (_el = el) != null && _el.ownerDocument; el = el.parentElement) {
    var _el;

    const display = window.getComputedStyle(el).display;

    if (display === 'none') {
      return false;
    }
  }

  return true;
}