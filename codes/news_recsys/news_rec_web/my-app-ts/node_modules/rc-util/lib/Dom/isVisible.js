"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(element) {
  if (!element) {
    return false;
  }

  if (element.offsetParent) {
    return true;
  }

  if (element.getBBox) {
    var box = element.getBBox();

    if (box.width || box.height) {
      return true;
    }
  }

  if (element.getBoundingClientRect) {
    var _box = element.getBoundingClientRect();

    if (_box.width || _box.height) {
      return true;
    }
  }

  return false;
};

exports.default = _default;