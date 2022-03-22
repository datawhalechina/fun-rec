"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProgressCircle = void 0;

var _react = _interopRequireDefault(require("react"));

var _nativeProps = require("../../utils/native-props");

var _withDefaultProps = require("../../utils/with-default-props");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classPrefix = `adm-progress-circle`;

const ProgressCircle = p => {
  const props = (0, _withDefaultProps.mergeProps)({
    percent: 0
  }, p);
  const style = {
    '--percent': props.percent.toString()
  };
  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    className: `${classPrefix}`,
    style: style
  }, _react.default.createElement("div", {
    className: `${classPrefix}-content`
  }, _react.default.createElement("svg", {
    className: `${classPrefix}-svg`
  }, _react.default.createElement("circle", {
    className: `${classPrefix}-track`,
    fill: 'transparent'
  }), _react.default.createElement("circle", {
    className: `${classPrefix}-fill`,
    fill: 'transparent'
  })), _react.default.createElement("div", {
    className: `${classPrefix}-info`
  }, props.children))));
};

exports.ProgressCircle = ProgressCircle;