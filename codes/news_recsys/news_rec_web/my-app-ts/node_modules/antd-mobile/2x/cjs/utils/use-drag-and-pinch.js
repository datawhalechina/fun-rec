"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDragAndPinch = void 0;

var _react = require("@use-gesture/react");

const useDragAndPinch = (0, _react.createUseGesture)([_react.dragAction, _react.pinchAction]);
exports.useDragAndPinch = useDragAndPinch;