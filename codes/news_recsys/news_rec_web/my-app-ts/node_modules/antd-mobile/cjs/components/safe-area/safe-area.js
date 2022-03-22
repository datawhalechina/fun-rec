"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SafeArea = void 0;

var _nativeProps = require("../../utils/native-props");

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classPrefix = 'adm-safe-area';

const SafeArea = props => {
  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    className: (0, _classnames.default)(classPrefix, `${classPrefix}-position-${props.position}`)
  }));
};

exports.SafeArea = SafeArea;