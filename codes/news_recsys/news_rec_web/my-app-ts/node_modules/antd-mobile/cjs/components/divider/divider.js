"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Divider = void 0;

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _nativeProps = require("../../utils/native-props");

var _withDefaultProps = require("../../utils/with-default-props");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classPrefix = `adm-divider`;
const defaultProps = {
  contentPosition: 'center'
};

const Divider = p => {
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, p);
  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    className: (0, _classnames.default)(classPrefix, `${classPrefix}-${props.contentPosition}`)
  }, props.children && _react.default.createElement("div", {
    className: `${classPrefix}-content`
  }, props.children)));
};

exports.Divider = Divider;