"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Avatar = void 0;

var _react = _interopRequireDefault(require("react"));

var _nativeProps = require("../../utils/native-props");

var _index = require("../../index");

var _withDefaultProps = require("../../utils/with-default-props");

var _fallback = require("./fallback");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classPrefix = 'adm-avatar';
const defaultProps = {
  fallback: _react.default.createElement(_fallback.Fallback, null),
  fit: 'cover'
};

const Avatar = p => {
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, p);
  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement(_index.Image, {
    className: classPrefix,
    src: props.src,
    fallback: props.fallback,
    placeholder: props.fallback,
    alt: props.alt,
    lazy: props.lazy,
    fit: props.fit,
    onClick: props.onClick,
    onError: props.onError
  }));
};

exports.Avatar = Avatar;