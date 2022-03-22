"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.closeFnSet = void 0;
exports.show = show;

var _react = _interopRequireDefault(require("react"));

var _modal = require("./modal");

var _renderImperatively = require("../../utils/render-imperatively");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const closeFnSet = new Set();
exports.closeFnSet = closeFnSet;

function show(props) {
  const handler = (0, _renderImperatively.renderImperatively)(_react.default.createElement(_modal.Modal, Object.assign({}, props, {
    afterClose: () => {
      var _a;

      closeFnSet.delete(handler.close);
      (_a = props.afterClose) === null || _a === void 0 ? void 0 : _a.call(props);
    }
  })));
  closeFnSet.add(handler.close);
  return handler;
}