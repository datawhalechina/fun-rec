"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpinLoading = void 0;

var _react = _interopRequireWildcard(require("react"));

var _nativeProps = require("../../utils/native-props");

var _withDefaultProps = require("../../utils/with-default-props");

var _web = require("@react-spring/web");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const classPrefix = 'adm-spin-loading';
const colorRecord = {
  default: 'var(--adm-color-weak)',
  primary: 'var(--adm-color-primary)',
  white: 'var(--adm-color-white)'
};
const defaultProps = {
  color: 'default'
};
const circumference = 15 * 3.14159265358979 * 2;
const SpinLoading = (0, _react.memo)(p => {
  var _a;

  const props = (0, _withDefaultProps.mergeProps)(defaultProps, p);
  const {
    percent
  } = (0, _web.useSpring)({
    loop: {
      reverse: true
    },
    from: {
      percent: 30
    },
    to: {
      percent: 80
    },
    config: {
      duration: 1200
    }
  });
  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement(_web.animated.div, {
    className: classPrefix,
    style: {
      '--color': (_a = colorRecord[props.color]) !== null && _a !== void 0 ? _a : props.color,
      '--percent': percent
    }
  }, _react.default.createElement("svg", {
    className: `${classPrefix}-svg`,
    viewBox: '0 0 32 32'
  }, _react.default.createElement(_web.animated.circle, {
    className: `${classPrefix}-fill`,
    fill: 'transparent',
    strokeWidth: '2',
    strokeDasharray: circumference,
    strokeDashoffset: percent,
    strokeLinecap: 'square',
    r: 15,
    cx: 16,
    cy: 16
  }))));
});
exports.SpinLoading = SpinLoading;