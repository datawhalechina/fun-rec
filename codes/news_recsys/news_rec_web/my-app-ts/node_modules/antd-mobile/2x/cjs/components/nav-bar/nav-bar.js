"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NavBar = void 0;

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _antdMobileIcons = require("antd-mobile-icons");

var _nativeProps = require("../../utils/native-props");

var _withDefaultProps = require("../../utils/with-default-props");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classPrefix = `adm-nav-bar`;
const defaultProps = {
  back: '',
  backArrow: true
};

const NavBar = p => {
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, p);
  const {
    back,
    backArrow
  } = props;
  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    className: (0, _classnames.default)(classPrefix)
  }, _react.default.createElement("div", {
    className: `${classPrefix}-left`,
    role: 'button'
  }, back !== null && _react.default.createElement("div", {
    className: `${classPrefix}-back`,
    onClick: props.onBack
  }, backArrow && _react.default.createElement("span", {
    className: `${classPrefix}-back-arrow`
  }, backArrow === true ? _react.default.createElement(_antdMobileIcons.LeftOutline, null) : backArrow), _react.default.createElement("span", {
    "aria-hidden": 'true'
  }, back)), props.left), _react.default.createElement("div", {
    className: `${classPrefix}-title`
  }, props.children), _react.default.createElement("div", {
    className: `${classPrefix}-right`
  }, props.right)));
};

exports.NavBar = NavBar;