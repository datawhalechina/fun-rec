"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearImageViewer = clearImageViewer;
exports.showImageViewer = showImageViewer;
exports.showMultiImageViewer = showMultiImageViewer;

var _react = _interopRequireDefault(require("react"));

var _imageViewer = require("./image-viewer");

var _renderImperatively = require("../../utils/render-imperatively");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const handlerSet = new Set();

function showImageViewer(props) {
  clearImageViewer();
  const handler = (0, _renderImperatively.renderImperatively)(_react.default.createElement(_imageViewer.ImageViewer, Object.assign({}, props, {
    afterClose: () => {
      var _a;

      handlerSet.delete(handler);
      (_a = props.afterClose) === null || _a === void 0 ? void 0 : _a.call(props);
    }
  })));
  handlerSet.add(handler);
  return handler;
}

function showMultiImageViewer(props) {
  clearImageViewer();
  const handler = (0, _renderImperatively.renderImperatively)(_react.default.createElement(_imageViewer.MultiImageViewer, Object.assign({}, props, {
    afterClose: () => {
      var _a;

      handlerSet.delete(handler);
      (_a = props.afterClose) === null || _a === void 0 ? void 0 : _a.call(props);
    }
  })));
  handlerSet.add(handler);
  return handler;
}

function clearImageViewer() {
  handlerSet.forEach(handler => {
    handler.close();
  });
  handlerSet.clear();
}