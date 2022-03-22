"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListItem = void 0;

var _react = _interopRequireDefault(require("react"));

var _nativeProps = require("../../utils/native-props");

var _antdMobileIcons = require("antd-mobile-icons");

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classPrefix = `adm-list-item`;

const ListItem = props => {
  var _a;

  const clickable = (_a = props.clickable) !== null && _a !== void 0 ? _a : !!props.onClick;
  const arrow = props.arrow === undefined ? clickable : props.arrow;

  const content = _react.default.createElement("div", {
    className: `${classPrefix}-content`
  }, props.prefix && _react.default.createElement("div", {
    className: `${classPrefix}-content-prefix`
  }, props.prefix), _react.default.createElement("div", {
    className: `${classPrefix}-content-main`
  }, props.title && _react.default.createElement("div", {
    className: `${classPrefix}-title`
  }, props.title), props.children, props.description && _react.default.createElement("div", {
    className: `${classPrefix}-description`
  }, props.description)), props.extra && _react.default.createElement("div", {
    className: `${classPrefix}-content-extra`
  }, props.extra), arrow && _react.default.createElement("div", {
    className: `${classPrefix}-content-arrow`
  }, arrow === true ? _react.default.createElement(_antdMobileIcons.RightOutline, null) : arrow));

  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement(clickable ? 'a' : 'div', {
    className: (0, _classnames.default)(`${classPrefix}`, clickable ? ['adm-plain-anchor'] : [], props.disabled && `${classPrefix}-disabled`),
    onClick: props.disabled ? undefined : props.onClick
  }, content));
};

exports.ListItem = ListItem;