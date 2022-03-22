"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.blur = blur;

var _utils = require("./utils");

function blur(element) {
  if (!(0, _utils.isFocusable)(element)) return;
  const wasActive = (0, _utils.getActiveElement)(element.ownerDocument) === element;
  if (!wasActive) return;
  (0, _utils.eventWrapper)(() => element.blur());
}