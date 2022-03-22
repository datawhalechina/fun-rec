"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Group = void 0;

var _react = _interopRequireDefault(require("react"));

var _withDefaultProps = require("../../utils/with-default-props");

var _groupContext = require("./group-context");

var _usePropsValue = require("../../utils/use-props-value");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultProps = {
  disabled: false,
  defaultValue: []
};

const Group = p => {
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, p);
  const [value, setValue] = (0, _usePropsValue.usePropsValue)(props);
  return _react.default.createElement(_groupContext.CheckboxGroupContext.Provider // TODO: 性能优化
  , {
    // TODO: 性能优化
    value: {
      value: value,
      disabled: props.disabled,
      check: v => {
        setValue([...value, v]);
      },
      uncheck: v => {
        setValue(value.filter(item => item !== v));
      }
    }
  }, props.children);
};

exports.Group = Group;