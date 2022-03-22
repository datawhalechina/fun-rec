"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Selector = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var _react = _interopRequireDefault(require("react"));

var _nativeProps = require("../../utils/native-props");

var _withDefaultProps = require("../../utils/with-default-props");

var _space = _interopRequireDefault(require("../space"));

var _grid = _interopRequireDefault(require("../grid"));

var _convertPx = require("../../utils/convert-px");

var _usePropsValue = require("../../utils/use-props-value");

var _checkMark = require("./check-mark");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classPrefix = `adm-selector`;
const defaultProps = {
  multiple: false,
  defaultValue: [],
  showCheckMark: true
};

const Selector = p => {
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, p);
  const [value, setValue] = (0, _usePropsValue.usePropsValue)({
    value: props.value,
    defaultValue: props.defaultValue,
    onChange: val => {
      var _a;

      const extend = {
        get items() {
          return props.options.filter(option => val.includes(option.value));
        }

      };
      (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, val, extend);
    }
  });
  const items = props.options.map(option => {
    const active = (value || []).includes(option.value);
    const disabled = option.disabled || props.disabled;
    const itemCls = (0, _classnames.default)(`${classPrefix}-item`, {
      [`${classPrefix}-item-active`]: active && !props.multiple,
      [`${classPrefix}-item-multiple-active`]: active && props.multiple,
      [`${classPrefix}-item-disabled`]: disabled
    });
    return _react.default.createElement("div", {
      key: option.value,
      className: itemCls,
      onClick: () => {
        if (disabled) {
          return;
        }

        if (props.multiple) {
          const val = active ? value.filter(v => v !== option.value) : [...value, option.value];
          setValue(val);
        } else {
          const val = active ? [] : [option.value];
          setValue(val);
        }
      }
    }, option.label, option.description && _react.default.createElement("div", {
      className: `${classPrefix}-item-description`
    }, option.description), active && props.showCheckMark && _react.default.createElement("div", {
      className: `${classPrefix}-check-mark-wrapper`
    }, _react.default.createElement(_checkMark.CheckMark, null)));
  });
  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    className: classPrefix
  }, !props.columns && _react.default.createElement(_space.default, {
    wrap: true
  }, items), props.columns && _react.default.createElement(_grid.default, {
    columns: props.columns,
    gap: (0, _convertPx.convertPx)(8)
  }, items)));
};

exports.Selector = Selector;