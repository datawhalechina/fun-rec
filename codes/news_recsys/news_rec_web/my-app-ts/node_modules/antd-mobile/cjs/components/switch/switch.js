"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Switch = void 0;

var _tslib = require("tslib");

var _classnames = _interopRequireDefault(require("classnames"));

var _react = _interopRequireWildcard(require("react"));

var _nativeProps = require("../../utils/native-props");

var _usePropsValue = require("../../utils/use-props-value");

var _withDefaultProps = require("../../utils/with-default-props");

var _spinIcon = require("./spin-icon");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classPrefix = `adm-switch`;
const defaultProps = {
  defaultChecked: false
};

const Switch = p => {
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, p);
  const disabled = props.disabled || props.loading || false;
  const [changing, setChanging] = (0, _react.useState)(false);
  const [checked, setChecked] = (0, _usePropsValue.usePropsValue)({
    value: props.checked,
    defaultValue: props.defaultChecked,
    onChange: props.onChange
  });

  function onClick() {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function* () {
      if (disabled || props.loading || changing) {
        return;
      }

      const nextChecked = !checked;

      if (props.beforeChange) {
        setChanging(true);

        try {
          yield props.beforeChange(nextChecked);
          setChecked(nextChecked);
          setChanging(false);
        } catch (e) {
          setChanging(false);
          throw e;
        }
      } else {
        setChecked(nextChecked);
      }
    });
  }

  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    onClick: onClick,
    className: (0, _classnames.default)(classPrefix, {
      [`${classPrefix}-checked`]: checked,
      [`${classPrefix}-disabled`]: disabled || changing
    })
  }, _react.default.createElement("div", {
    className: `${classPrefix}-checkbox`
  }, _react.default.createElement("div", {
    className: `${classPrefix}-handle`
  }, (props.loading || changing) && _react.default.createElement(_spinIcon.SpinIcon, {
    className: `${classPrefix}-spin-icon`
  })), _react.default.createElement("div", {
    className: `${classPrefix}-inner`
  }, checked ? props.checkedText : props.uncheckedText))));
};

exports.Switch = Switch;