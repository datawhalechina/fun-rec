"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Button = void 0;

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _dotLoading = _interopRequireDefault(require("../dot-loading"));

var _withDefaultProps = require("../../utils/with-default-props");

var _nativeProps = require("../../utils/native-props");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classPrefix = `adm-button`;
const defaultProps = {
  color: 'default',
  fill: 'solid',
  block: false,
  loading: false,
  type: 'button',
  shape: 'default',
  size: 'middle'
};

const Button = p => {
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, p);
  const disabled = props.disabled || props.loading;
  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("button", {
    type: props.type,
    onClick: props.onClick,
    className: (0, _classnames.default)(classPrefix, props.color ? `${classPrefix}-${props.color}` : null, {
      [`${classPrefix}-block`]: props.block,
      [`${classPrefix}-disabled`]: disabled,
      [`${classPrefix}-fill-outline`]: props.fill === 'outline',
      [`${classPrefix}-fill-none`]: props.fill === 'none',
      [`${classPrefix}-mini`]: props.size === 'mini',
      [`${classPrefix}-small`]: props.size === 'small',
      [`${classPrefix}-large`]: props.size === 'large',
      [`${classPrefix}-loading`]: props.loading
    }, `${classPrefix}-shape-${props.shape}`),
    disabled: disabled
  }, props.loading ? _react.default.createElement("div", {
    className: `${classPrefix}-loading-wrapper`
  }, _react.default.createElement(_dotLoading.default, {
    color: 'currentColor'
  }), props.loadingText) : props.children));
};

exports.Button = Button;