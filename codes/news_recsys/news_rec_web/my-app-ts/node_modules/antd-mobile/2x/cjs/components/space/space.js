"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Space = void 0;

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _nativeProps = require("../../utils/native-props");

var _withDefaultProps = require("../../utils/with-default-props");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classPrefix = `adm-space`;
const defaultProps = {
  direction: 'horizontal'
};

const Space = p => {
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, p);
  const {
    direction,
    onClick
  } = props;
  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    className: (0, _classnames.default)(classPrefix, {
      [`${classPrefix}-wrap`]: props.wrap,
      [`${classPrefix}-block`]: props.block,
      [`${classPrefix}-${direction}`]: true,
      [`${classPrefix}-align-${props.align}`]: !!props.align,
      [`${classPrefix}-justify-${props.justify}`]: !!props.justify
    }),
    onClick: onClick
  }, _react.default.Children.map(props.children, child => {
    return child !== null && child !== undefined && _react.default.createElement("div", {
      className: `${classPrefix}-item`
    }, child);
  })));
};

exports.Space = Space;