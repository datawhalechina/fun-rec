"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Step = void 0;

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _nativeProps = require("../../utils/native-props");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classPrefix = `adm-step`;

const Step = props => {
  const {
    title,
    description,
    icon,
    status = 'wait'
  } = props;
  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    className: (0, _classnames.default)(`${classPrefix}`, `${classPrefix}-status-${status}`)
  }, _react.default.createElement("div", {
    className: `${classPrefix}-indicator`
  }, _react.default.createElement("div", {
    className: `${classPrefix}-icon-container`
  }, icon)), _react.default.createElement("div", {
    className: `${classPrefix}-content`
  }, _react.default.createElement("div", {
    className: `${classPrefix}-title`
  }, title), !!description && _react.default.createElement("div", {
    className: `${classPrefix}-description`
  }, description))));
};

exports.Step = Step;