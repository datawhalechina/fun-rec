"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveContainer = resolveContainer;

function resolveContainer(getContainer) {
  const container = typeof getContainer === 'function' ? getContainer() : getContainer;
  return container || document.body;
}