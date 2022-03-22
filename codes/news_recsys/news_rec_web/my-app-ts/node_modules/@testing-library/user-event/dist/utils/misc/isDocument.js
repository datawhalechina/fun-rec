"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDocument = isDocument;

function isDocument(el) {
  return el.nodeType === el.DOCUMENT_NODE;
}