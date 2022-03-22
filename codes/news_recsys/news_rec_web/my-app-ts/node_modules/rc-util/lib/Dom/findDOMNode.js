"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findDOMNode;

var _reactDom = _interopRequireDefault(require("react-dom"));

/**
 * Return if a node is a DOM node. Else will return by `findDOMNode`
 */
function findDOMNode(node) {
  if (node instanceof HTMLElement) {
    return node;
  }

  return _reactDom.default.findDOMNode(node);
}