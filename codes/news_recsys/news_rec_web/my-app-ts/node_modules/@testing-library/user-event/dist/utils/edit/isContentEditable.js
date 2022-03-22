"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isContentEditable = isContentEditable;

//jsdom is not supporting isContentEditable
function isContentEditable(element) {
  return element.hasAttribute('contenteditable') && (element.getAttribute('contenteditable') == 'true' || element.getAttribute('contenteditable') == '');
}