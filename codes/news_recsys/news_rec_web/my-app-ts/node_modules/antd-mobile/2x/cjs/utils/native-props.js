"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withNativeProps = withNativeProps;

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function withNativeProps(props, element) {
  const p = Object.assign({}, element.props);

  if (props.className) {
    p.className = (0, _classnames.default)(element.props.className, props.className);
  }

  if (props.style) {
    p.style = Object.assign(Object.assign({}, p.style), props.style);
  }

  if (props.tabIndex !== undefined) {
    p.tabIndex = props.tabIndex;
  }

  for (const key in props) {
    if (!props.hasOwnProperty(key)) continue;

    if (key.startsWith('data-') || key.startsWith('aria-')) {
      p[key] = props[key];
    }
  }

  return _react.default.cloneElement(element, p);
}