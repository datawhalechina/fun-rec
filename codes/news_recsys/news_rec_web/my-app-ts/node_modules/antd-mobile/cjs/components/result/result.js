"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Result = void 0;

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _antdMobileIcons = require("antd-mobile-icons");

var _nativeProps = require("../../utils/native-props");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classPrefix = `adm-result`;
const iconRecord = {
  success: _antdMobileIcons.CheckCircleFill,
  error: _antdMobileIcons.CloseCircleFill,
  info: _antdMobileIcons.InformationCircleFill,
  waiting: _antdMobileIcons.ClockCircleFill,
  warning: _antdMobileIcons.ExclamationCircleFill
};

const Result = props => {
  const {
    status,
    title,
    description,
    icon
  } = props;
  if (!status) return null;

  const resultIcon = icon || _react.default.createElement(iconRecord[status]);

  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    className: (0, _classnames.default)(classPrefix, `${classPrefix}-${status}`)
  }, _react.default.createElement("div", {
    className: `${classPrefix}-icon`
  }, resultIcon), _react.default.createElement("div", {
    className: `${classPrefix}-title`
  }, title), description ? _react.default.createElement("div", {
    className: `${classPrefix}-description`
  }, description) : null));
};

exports.Result = Result;