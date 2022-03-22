"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.focus = focus;

var _utils = require("./utils");

function focus(element) {
  if (!(0, _utils.isFocusable)(element)) return;
  const isAlreadyActive = (0, _utils.getActiveElement)(element.ownerDocument) === element;
  if (isAlreadyActive) return;
  (0, _utils.eventWrapper)(() => element.focus());
}