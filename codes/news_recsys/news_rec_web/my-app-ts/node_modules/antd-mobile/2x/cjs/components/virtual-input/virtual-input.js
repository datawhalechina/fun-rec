"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VirtualInput = void 0;

var _react = _interopRequireWildcard(require("react"));

var _nativeProps = require("../../utils/native-props");

var _withDefaultProps = require("../../utils/with-default-props");

var _usePropsValue = require("../../utils/use-props-value");

var _classnames = _interopRequireDefault(require("classnames"));

var _antdMobileIcons = require("antd-mobile-icons");

var _ahooks = require("ahooks");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const classPrefix = 'adm-virtual-input';
const defaultProps = {
  defaultValue: ''
};
const VirtualInput = (0, _react.forwardRef)((p, ref) => {
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, p);
  const [value, setValue] = (0, _usePropsValue.usePropsValue)(props);
  const rootRef = (0, _react.useRef)(null);
  const contentRef = (0, _react.useRef)(null);
  const [hasFocus, setHasFocus] = (0, _react.useState)(false);

  function scrollToEnd() {
    const root = rootRef.current;
    if (!root) return;

    if (document.activeElement !== root) {
      return;
    }

    const content = contentRef.current;
    if (!content) return;
    content.scrollLeft = content.clientWidth;
  }

  (0, _ahooks.useIsomorphicLayoutEffect)(() => {
    scrollToEnd();
  }, [value]);
  (0, _react.useEffect)(() => {
    if (hasFocus) {
      scrollToEnd();
    }
  }, [hasFocus]);
  (0, _react.useImperativeHandle)(ref, () => ({
    focus: () => {
      var _a;

      (_a = rootRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    },
    blur: () => {
      var _a;

      (_a = rootRef.current) === null || _a === void 0 ? void 0 : _a.blur();
    }
  }));

  function onFocus() {
    var _a;

    setHasFocus(true);
    (_a = props.onFocus) === null || _a === void 0 ? void 0 : _a.call(props);
  }

  function onBlur() {
    var _a;

    setHasFocus(false);
    (_a = props.onBlur) === null || _a === void 0 ? void 0 : _a.call(props);
  }

  const keyboard = props.keyboard;

  const keyboardElement = keyboard && _react.default.cloneElement(keyboard, {
    onInput: v => {
      var _a, _b;

      setValue(value + v);
      (_b = (_a = keyboard.props).onInput) === null || _b === void 0 ? void 0 : _b.call(_a, v);
    },
    onDelete: () => {
      var _a, _b;

      setValue(value.slice(0, -1));
      (_b = (_a = keyboard.props).onDelete) === null || _b === void 0 ? void 0 : _b.call(_a);
    },
    visible: hasFocus,
    onClose: () => {
      var _a, _b, _c;

      (_a = rootRef.current) === null || _a === void 0 ? void 0 : _a.blur();
      (_c = (_b = keyboard.props).onClose) === null || _c === void 0 ? void 0 : _c.call(_b);
    }
  });

  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    ref: rootRef,
    className: (0, _classnames.default)(classPrefix, {
      [`${classPrefix}-disabled`]: props.disabled
    }),
    tabIndex: props.disabled ? undefined : 0,
    onFocus: onFocus,
    onBlur: onBlur,
    onClick: props.onClick
  }, _react.default.createElement("div", {
    className: `${classPrefix}-content`,
    ref: contentRef
  }, value, _react.default.createElement("div", {
    className: `${classPrefix}-caret-container`
  }, hasFocus && _react.default.createElement("div", {
    className: `${classPrefix}-caret`
  }))), props.clearable && !!value && hasFocus && _react.default.createElement("div", {
    className: `${classPrefix}-clear`,
    onClick: e => {
      var _a;

      e.stopPropagation();
      setValue('');
      (_a = props.onClear) === null || _a === void 0 ? void 0 : _a.call(props);
    }
  }, _react.default.createElement(_antdMobileIcons.CloseCircleFill, null)), !value && _react.default.createElement("div", {
    className: `${classPrefix}-placeholder`
  }, props.placeholder), keyboardElement));
});
exports.VirtualInput = VirtualInput;