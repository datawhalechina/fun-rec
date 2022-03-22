"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DotLoading = void 0;

var _react = _interopRequireWildcard(require("react"));

var _withDefaultProps = require("../../utils/with-default-props");

var _nativeProps = require("../../utils/native-props");

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const classPrefix = `adm-dot-loading`;
const colorRecord = {
  default: 'var(--adm-color-weak)',
  primary: 'var(--adm-color-primary)',
  white: 'var(--adm-color-white)'
};
const defaultProps = {
  color: 'default'
};
const DotLoading = (0, _react.memo)(p => {
  var _a;

  const props = (0, _withDefaultProps.mergeProps)(defaultProps, p);
  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    style: {
      color: (_a = colorRecord[props.color]) !== null && _a !== void 0 ? _a : props.color
    },
    className: (0, _classnames.default)('adm-loading', classPrefix)
  }, _react.default.createElement("svg", {
    height: '1em',
    viewBox: '0 0 100 40',
    style: {
      verticalAlign: '-0.125em'
    }
  }, _react.default.createElement("g", {
    stroke: 'none',
    strokeWidth: '1',
    fill: 'none',
    fillRule: 'evenodd'
  }, _react.default.createElement("g", {
    transform: 'translate(-100.000000, -71.000000)'
  }, _react.default.createElement("g", {
    transform: 'translate(95.000000, 71.000000)'
  }, _react.default.createElement("g", {
    transform: 'translate(5.000000, 0.000000)'
  }, [0, 1, 2].map(i => _react.default.createElement("rect", {
    key: i,
    fill: 'currentColor',
    x: 20 + i * 26,
    y: '16',
    width: '8',
    height: '8',
    rx: '2'
  }, _react.default.createElement("animate", {
    attributeName: 'y',
    from: '16',
    to: '16',
    dur: '2s',
    begin: `${i * 0.2}s`,
    repeatCount: 'indefinite',
    values: '16; 6; 26; 16; 16',
    keyTimes: '0; 0.1; 0.3; 0.4; 1'
  }))))))))));
});
exports.DotLoading = DotLoading;