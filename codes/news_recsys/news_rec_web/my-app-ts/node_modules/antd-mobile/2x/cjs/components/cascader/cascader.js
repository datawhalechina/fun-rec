"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cascader = void 0;

var _react = _interopRequireWildcard(require("react"));

var _popup = _interopRequireDefault(require("../popup"));

var _withDefaultProps = require("../../utils/with-default-props");

var _nativeProps = require("../../utils/native-props");

var _usePropsValue = require("../../utils/use-props-value");

var _cascaderView = _interopRequireDefault(require("../cascader-view"));

var _configProvider = require("../config-provider");

var _useCascaderValueExtend = require("../cascader-view/use-cascader-value-extend");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const classPrefix = `adm-cascader`;
const defaultProps = {
  defaultValue: []
};

const Cascader = p => {
  var _a;

  const {
    locale
  } = (0, _configProvider.useConfig)();
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, {
    confirmText: locale.common.confirm,
    cancelText: locale.common.cancel,
    placeholder: locale.Cascader.placeholder
  }, p);
  const [value, setValue] = (0, _usePropsValue.usePropsValue)(Object.assign(Object.assign({}, props), {
    onChange: val => {
      var _a;

      (_a = props.onConfirm) === null || _a === void 0 ? void 0 : _a.call(props, val, generateValueExtend(val));
    }
  }));
  const generateValueExtend = (0, _useCascaderValueExtend.useCascaderValueExtend)(props.options);
  const [innerValue, setInnerValue] = (0, _react.useState)(value);
  (0, _react.useEffect)(() => {
    if (!props.visible) {
      setInnerValue(value);
    }
  }, [props.visible]);
  (0, _react.useEffect)(() => {
    if (!props.visible) {
      setInnerValue(value);
    }
  }, [value]);
  const cascaderElement = (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    className: classPrefix
  }, _react.default.createElement("div", {
    className: `${classPrefix}-header`
  }, _react.default.createElement("a", {
    className: `${classPrefix}-header-button`,
    onClick: () => {
      var _a, _b;

      (_a = props.onCancel) === null || _a === void 0 ? void 0 : _a.call(props);
      (_b = props.onClose) === null || _b === void 0 ? void 0 : _b.call(props);
    }
  }, props.cancelText), _react.default.createElement("div", {
    className: `${classPrefix}-header-title`
  }, props.title), _react.default.createElement("a", {
    className: `${classPrefix}-header-button`,
    onClick: () => {
      var _a;

      setValue(innerValue);
      (_a = props.onClose) === null || _a === void 0 ? void 0 : _a.call(props);
    }
  }, props.confirmText)), _react.default.createElement("div", {
    className: `${classPrefix}-body`
  }, _react.default.createElement(_cascaderView.default, Object.assign({}, props, {
    value: innerValue,
    onChange: (val, ext) => {
      var _a;

      setInnerValue(val);

      if (props.visible) {
        (_a = props.onSelect) === null || _a === void 0 ? void 0 : _a.call(props, val, ext);
      }
    }
  })))));

  const popupElement = _react.default.createElement(_popup.default, {
    visible: props.visible,
    position: 'bottom',
    onMaskClick: () => {
      var _a, _b;

      (_a = props.onCancel) === null || _a === void 0 ? void 0 : _a.call(props);
      (_b = props.onClose) === null || _b === void 0 ? void 0 : _b.call(props);
    },
    getContainer: props.getContainer,
    destroyOnClose: true,
    afterShow: props.afterShow,
    afterClose: props.afterClose,
    onClick: props.onClick,
    stopPropagation: props.stopPropagation
  }, cascaderElement);

  return _react.default.createElement(_react.default.Fragment, null, popupElement, (_a = props.children) === null || _a === void 0 ? void 0 : _a.call(props, generateValueExtend(value).items));
};

exports.Cascader = Cascader;