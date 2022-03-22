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
  defaultValue: null
};

const Group = p => {
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, p);
  const [value, setValue] = (0, _usePropsValue.usePropsValue)({
    value: props.value,
    defaultValue: props.defaultValue,
    onChange: v => {
      var _a;

      if (v === null) return;
      (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, v);
    }
  });
  return _react.default.createElement(_groupContext.RadioGroupContext.Provider // TODO: 性能优化
  , {
    // TODO: 性能优化
    value: {
      value: value === null ? [] : [value],
      check: v => {
        setValue(v);
      },
      uncheck: () => {},
      disabled: props.disabled
    }
  }, props.children);
};

exports.Group = Group;