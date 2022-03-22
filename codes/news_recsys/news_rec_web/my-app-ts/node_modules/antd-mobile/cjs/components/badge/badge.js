"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dot = exports.Badge = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var _react = _interopRequireDefault(require("react"));

var _nativeProps = require("../../utils/native-props");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classPrefix = `adm-badge`;
const dot = Symbol();
exports.dot = dot;

const Badge = props => {
  const {
    content,
    color,
    children
  } = props;
  const isDot = content === dot;
  const badgeCls = (0, _classnames.default)(classPrefix, !!children && `${classPrefix}-fixed`, isDot && `${classPrefix}-dot`, props.bordered && `${classPrefix}-bordered`);
  const element = content || content === 0 ? (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    className: badgeCls,
    style: {
      '--color': color
    }
  }, !isDot && _react.default.createElement("div", {
    className: `${classPrefix}-content`
  }, content))) : null;
  return children ? _react.default.createElement("div", {
    className: `${classPrefix}-wrap`
  }, children, element) : element;
};

exports.Badge = Badge;