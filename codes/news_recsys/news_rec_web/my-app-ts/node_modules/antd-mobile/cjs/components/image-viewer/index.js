"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./image-viewer.css");

var _attachPropertiesToComponent = require("../../utils/attach-properties-to-component");

var _imageViewer2 = require("./image-viewer");

var _methods = require("./methods");

const Multi = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_imageViewer2.MultiImageViewer, {
  show: _methods.showMultiImageViewer
});

var _default = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_imageViewer2.ImageViewer, {
  Multi,
  show: _methods.showImageViewer,
  clear: _methods.clearImageViewer
});

exports.default = _default;