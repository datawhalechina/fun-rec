"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Checkbox = void 0;

var _react = _interopRequireWildcard(require("react"));

var _nativeProps = require("../../utils/native-props");

var _classnames = _interopRequireDefault(require("classnames"));

var _groupContext = require("./group-context");

var _usePropsValue = require("../../utils/use-props-value");

var _withDefaultProps = require("../../utils/with-default-props");

var _devLog = require("../../utils/dev-log");

var _checkIcon = require("./check-icon");

var _indeterminateIcon = require("./indeterminate-icon");

var _isDev = require("../../utils/is-dev");

var _nativeInput = require("./native-input");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const classPrefix = `adm-checkbox`;
const defaultProps = {
  defaultChecked: false,
  indeterminate: false
};

const Checkbox = p => {
  const groupContext = (0, _react.useContext)(_groupContext.CheckboxGroupContext);
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, p);
  let [checked, setChecked] = (0, _usePropsValue.usePropsValue)({
    value: props.checked,
    defaultValue: props.defaultChecked,
    onChange: props.onChange
  });
  let disabled = props.disabled;
  const {
    value
  } = props;

  if (groupContext && value !== undefined) {
    if (_isDev.isDev) {
      if (p.checked !== undefined) {
        (0, _devLog.devWarning)('Checkbox', 'When used within `Checkbox.Group`, the `checked` prop of `Checkbox` will not work.');
      }

      if (p.defaultChecked !== undefined) {
        (0, _devLog.devWarning)('Checkbox', 'When used within `Checkbox.Group`, the `defaultChecked` prop of `Checkbox` will not work.');
      }
    }

    checked = groupContext.value.includes(value);

    setChecked = checked => {
      var _a;

      if (checked) {
        groupContext.check(value);
      } else {
        groupContext.uncheck(value);
      }

      (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, checked);
    };

    disabled = disabled || groupContext.disabled;
  }

  const renderIcon = () => {
    if (props.icon) {
      return _react.default.createElement("div", {
        className: `${classPrefix}-custom-icon`
      }, props.icon(checked, props.indeterminate));
    }

    return _react.default.createElement("div", {
      className: `${classPrefix}-icon`
    }, props.indeterminate ? _react.default.createElement(_indeterminateIcon.IndeterminateIcon, null) : checked && _react.default.createElement(_checkIcon.CheckIcon, null));
  };

  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("label", {
    className: (0, _classnames.default)(classPrefix, {
      [`${classPrefix}-checked`]: checked && !props.indeterminate,
      [`${classPrefix}-indeterminate`]: props.indeterminate,
      [`${classPrefix}-disabled`]: disabled,
      [`${classPrefix}-block`]: props.block
    })
  }, _react.default.createElement(_nativeInput.NativeInput, {
    type: 'checkbox',
    checked: checked,
    onChange: setChecked,
    disabled: disabled,
    id: props.id
  }), renderIcon(), props.children && _react.default.createElement("div", {
    className: `${classPrefix}-content`
  }, props.children)));
};

exports.Checkbox = Checkbox;