"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createIconComponent = createIconComponent;

function createIconComponent(svg) {
  const Icon = () => {
    return svg;
  };

  return Icon;
}