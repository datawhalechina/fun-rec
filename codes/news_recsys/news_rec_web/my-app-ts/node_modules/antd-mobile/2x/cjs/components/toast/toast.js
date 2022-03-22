"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InternalToast = void 0;

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _antdMobileIcons = require("antd-mobile-icons");

var _mask = _interopRequireDefault(require("../mask"));

var _withDefaultProps = require("../../utils/with-default-props");

var _autoCenter = _interopRequireDefault(require("../auto-center"));

var _spinLoading = _interopRequireDefault(require("../spin-loading"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const classPrefix = `adm-toast`;
const defaultProps = {
  maskClickable: true,
  stopPropagation: ['click']
};

const InternalToast = p => {
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, p);
  const {
    maskClickable,
    content,
    icon,
    position
  } = props;
  const iconElement = (0, _react.useMemo)(() => {
    if (icon === null || icon === undefined) return null;

    switch (icon) {
      case 'success':
        return _react.default.createElement(_antdMobileIcons.CheckOutline, null);

      case 'fail':
        return _react.default.createElement(_antdMobileIcons.CloseOutline, null);

      case 'loading':
        return _react.default.createElement(_spinLoading.default, {
          color: 'white',
          className: `${classPrefix}-loading`
        });

      default:
        return icon;
    }
  }, [icon]);
  const top = (0, _react.useMemo)(() => {
    switch (position) {
      case 'top':
        return '20%';

      case 'bottom':
        return '80%';

      default:
        return '50%';
    }
  }, [position]);
  return _react.default.createElement(_mask.default, {
    visible: props.visible,
    destroyOnClose: true,
    opacity: 0,
    disableBodyScroll: !maskClickable,
    getContainer: props.getContainer,
    afterClose: props.afterClose,
    style: Object.assign({
      pointerEvents: maskClickable ? 'none' : 'auto'
    }, props.maskStyle),
    className: (0, _classnames.default)(`${classPrefix}-mask`, props.maskClassName),
    stopPropagation: props.stopPropagation
  }, _react.default.createElement("div", {
    className: (0, _classnames.default)(`${classPrefix}-wrap`)
  }, _react.default.createElement("div", {
    style: {
      top
    },
    className: (0, _classnames.default)(`${classPrefix}-main`, icon ? `${classPrefix}-main-icon` : `${classPrefix}-main-text`)
  }, iconElement && _react.default.createElement("div", {
    className: `${classPrefix}-icon`
  }, iconElement), _react.default.createElement(_autoCenter.default, null, content))));
};

exports.InternalToast = InternalToast;