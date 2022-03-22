"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tag = void 0;

var _react = _interopRequireDefault(require("react"));

var _withDefaultProps = require("../../utils/with-default-props");

var _nativeProps = require("../../utils/native-props");

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classPrefix = `adm-tag`;
const colorRecord = {
  default: '#666666',
  primary: 'var(--adm-color-primary, #1677ff)',
  success: 'var(--adm-color-success, #00b578)',
  warning: 'var(--adm-color-warning, #ff8f1f)',
  danger: 'var(--adm-color-danger, #ff3141)'
};
const defaultProps = {
  color: 'default',
  fill: 'solid',
  round: false
};

const Tag = p => {
  var _a;

  const props = (0, _withDefaultProps.mergeProps)(defaultProps, p);
  const color = (_a = colorRecord[props.color]) !== null && _a !== void 0 ? _a : props.color;
  const style = {
    '--border-color': color,
    '--text-color': props.fill === 'outline' ? color : '#ffffff',
    '--background-color': props.fill === 'outline' ? 'transparent' : color
  };
  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("span", {
    style: style,
    onClick: props.onClick,
    className: (0, _classnames.default)(classPrefix, {
      [`${classPrefix}-round`]: props.round
    })
  }, props.children));
};

exports.Tag = Tag;