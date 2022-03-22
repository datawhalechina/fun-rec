"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchBar = void 0;

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _input = _interopRequireDefault(require("../input"));

var _button = _interopRequireDefault(require("../button"));

var _nativeProps = require("../../utils/native-props");

var _withDefaultProps = require("../../utils/with-default-props");

var _antdMobileIcons = require("antd-mobile-icons");

var _usePropsValue = require("../../utils/use-props-value");

var _configProvider = require("../config-provider");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const classPrefix = `adm-search-bar`;
const defaultProps = {
  clearable: true,
  showCancelButton: false,
  defaultValue: '',
  clearOnCancel: true,
  icon: _react.default.createElement(_antdMobileIcons.SearchOutline, null)
};
const SearchBar = (0, _react.forwardRef)((p, ref) => {
  const {
    locale
  } = (0, _configProvider.useConfig)();
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, {
    cancelText: locale.common.cancel
  }, p);
  const [value, setValue] = (0, _usePropsValue.usePropsValue)(props);
  const [hasFocus, setHasFocus] = (0, _react.useState)(false);
  const inputRef = (0, _react.useRef)(null);
  (0, _react.useImperativeHandle)(ref, () => ({
    clear: () => {
      var _a;

      return (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.clear();
    },
    focus: () => {
      var _a;

      return (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    },
    blur: () => {
      var _a;

      return (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.blur();
    }
  }));

  const renderCancelButton = () => {
    let isShowCancel = false;

    if (typeof props.showCancelButton === 'function') {
      isShowCancel = props.showCancelButton(hasFocus, value);
    } else {
      isShowCancel = props.showCancelButton && hasFocus;
    }

    return isShowCancel && _react.default.createElement("div", {
      className: `${classPrefix}-suffix`,
      onMouseDown: e => {
        e.preventDefault();
      },
      onTouchStart: e => {
        e.preventDefault();
      }
    }, _react.default.createElement(_button.default, {
      fill: 'none',
      className: `${classPrefix}-cancel-button`,
      onClick: () => {
        var _a, _b, _c;

        if (props.clearOnCancel) {
          (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.clear();
        }

        (_b = inputRef.current) === null || _b === void 0 ? void 0 : _b.blur();
        (_c = props.onCancel) === null || _c === void 0 ? void 0 : _c.call(props);
      }
    }, props.cancelText));
  };

  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    className: (0, _classnames.default)(classPrefix, {
      [`${classPrefix}-active`]: hasFocus
    })
  }, _react.default.createElement("div", {
    className: `${classPrefix}-input-box`
  }, props.icon && _react.default.createElement("div", {
    className: `${classPrefix}-input-box-icon`
  }, props.icon), _react.default.createElement(_input.default, {
    ref: inputRef,
    className: (0, _classnames.default)(`${classPrefix}-input`, {
      [`${classPrefix}-input-without-icon`]: !props.icon
    }),
    value: value,
    onChange: setValue,
    maxLength: props.maxLength,
    placeholder: props.placeholder,
    clearable: props.clearable,
    onFocus: e => {
      var _a;

      setHasFocus(true);
      (_a = props.onFocus) === null || _a === void 0 ? void 0 : _a.call(props, e);
    },
    onBlur: e => {
      var _a;

      setHasFocus(false);
      (_a = props.onBlur) === null || _a === void 0 ? void 0 : _a.call(props, e);
    },
    onClear: props.onClear,
    type: 'search',
    enterKeyHint: 'search',
    onEnterPress: () => {
      var _a, _b;

      (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.blur();
      (_b = props.onSearch) === null || _b === void 0 ? void 0 : _b.call(props, value);
    }
  })), renderCancelButton()));
});
exports.SearchBar = SearchBar;