"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NumberKeyboard = void 0;

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _antdMobileIcons = require("antd-mobile-icons");

var _withDefaultProps = require("../../utils/with-default-props");

var _shuffle = require("../../utils/shuffle");

var _popup = _interopRequireDefault(require("../popup"));

var _nativeProps = require("../../utils/native-props");

var _safeArea = _interopRequireDefault(require("../safe-area"));

var _ahooks = require("ahooks");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const classPrefix = 'adm-number-keyboard';
const defaultProps = {
  defaultVisible: false,
  randomOrder: false,
  showCloseButton: true,
  confirmText: null,
  closeOnConfirm: true,
  safeArea: true
};

const NumberKeyboard = p => {
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, p);
  const {
    visible,
    title,
    getContainer,
    confirmText,
    customKey,
    randomOrder,
    showCloseButton,
    onInput
  } = props;
  const keyboardRef = (0, _react.useRef)(null);
  const keys = (0, _react.useMemo)(() => {
    const defaultKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const keyList = randomOrder ? (0, _shuffle.shuffle)(defaultKeys) : defaultKeys;
    keyList.push('0');

    if (confirmText) {
      keyList.push(customKey || '');
    } else {
      keyList.splice(9, 0, customKey || '');
      keyList.push('BACKSPACE');
    }

    return keyList;
  }, [customKey, confirmText, randomOrder, randomOrder && visible]);
  const timeoutRef = (0, _react.useRef)(-1);
  const intervalRef = (0, _react.useRef)(-1);
  const onDelete = (0, _ahooks.useMemoizedFn)(() => {
    var _a;

    (_a = props.onDelete) === null || _a === void 0 ? void 0 : _a.call(props);
  });

  const onBackspacePressStart = () => {
    timeoutRef.current = window.setTimeout(() => {
      onDelete();
      intervalRef.current = window.setInterval(onDelete, 150);
    }, 700);
  };

  const onBackspacePressEnd = () => {
    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);
  }; // 点击键盘按键


  const onKeyPress = (e, key) => {
    var _a, _b;

    e.preventDefault();

    switch (key) {
      case 'BACKSPACE':
        onDelete === null || onDelete === void 0 ? void 0 : onDelete();
        break;

      case 'OK':
        (_a = props.onConfirm) === null || _a === void 0 ? void 0 : _a.call(props);

        if (props.closeOnConfirm) {
          (_b = props.onClose) === null || _b === void 0 ? void 0 : _b.call(props);
        }

        break;

      default:
        // 当 customKey 不存在时，点击该键不应该触发 onInput
        if (key !== '') onInput === null || onInput === void 0 ? void 0 : onInput(key);
        break;
    }
  }; // 渲染 title 和 close button


  const renderHeader = () => {
    if (!showCloseButton && !title) return null;
    return _react.default.createElement("div", {
      className: (0, _classnames.default)(`${classPrefix}-header`, {
        'with-title': !!title
      })
    }, title && _react.default.createElement("div", {
      className: `${classPrefix}-title`
    }, title), showCloseButton && _react.default.createElement("span", {
      className: `${classPrefix}-header-close-button`,
      onClick: () => {
        var _a;

        (_a = props.onClose) === null || _a === void 0 ? void 0 : _a.call(props);
      },
      role: 'button',
      title: 'CLOSE'
    }, _react.default.createElement(_antdMobileIcons.DownOutline, null)));
  }; // 渲染基础键盘按键


  const renderKey = (key, index) => {
    const isNumberKey = /^\d$/.test(key);
    const className = (0, _classnames.default)(`${classPrefix}-key`, {
      'number-key': isNumberKey,
      'sign-key': !isNumberKey && key,
      'mid-key': index === 9 && !!confirmText
    });
    return _react.default.createElement("div", {
      key: key,
      className: className,
      onTouchStart: () => {
        if (key === 'BACKSPACE') {
          onBackspacePressStart();
        }
      },
      onTouchEnd: e => {
        onKeyPress(e, key);

        if (key === 'BACKSPACE') {
          onBackspacePressEnd();
        }
      },
      onMouseUp: e => {
        onKeyPress(e, key);
      },
      title: key,
      role: 'button'
    }, key === 'BACKSPACE' ? _react.default.createElement(_antdMobileIcons.TextDeletionOutline, null) : key);
  };

  return _react.default.createElement(_popup.default, {
    visible: visible,
    getContainer: getContainer,
    mask: false,
    afterClose: props.afterClose,
    afterShow: props.afterShow,
    className: `${classPrefix}-popup`,
    stopPropagation: props.stopPropagation
  }, (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    ref: keyboardRef,
    className: classPrefix,
    onMouseDown: e => {
      e.preventDefault();
    }
  }, renderHeader(), _react.default.createElement("div", {
    className: `${classPrefix}-wrapper`
  }, _react.default.createElement("div", {
    className: (0, _classnames.default)(`${classPrefix}-main`, {
      'confirmed-style': !!confirmText
    })
  }, keys.map(renderKey)), !!confirmText && _react.default.createElement("div", {
    className: `${classPrefix}-confirm`
  }, _react.default.createElement("div", {
    className: `${classPrefix}-key extra-key bs-key`,
    onTouchStart: () => {
      onBackspacePressStart();
    },
    onTouchEnd: e => {
      onKeyPress(e, 'BACKSPACE');
      onBackspacePressEnd();
    },
    onMouseUp: e => onKeyPress(e, 'BACKSPACE'),
    title: 'BACKSPACE',
    role: 'button'
  }, _react.default.createElement(_antdMobileIcons.TextDeletionOutline, null)), _react.default.createElement("div", {
    className: `${classPrefix}-key extra-key ok-key`,
    onTouchEnd: e => onKeyPress(e, 'OK'),
    onMouseUp: e => onKeyPress(e, 'OK'),
    role: 'button'
  }, confirmText))), props.safeArea && _react.default.createElement("div", {
    className: `${classPrefix}-footer`
  }, _react.default.createElement(_safeArea.default, {
    position: 'bottom'
  })))));
};

exports.NumberKeyboard = NumberKeyboard;