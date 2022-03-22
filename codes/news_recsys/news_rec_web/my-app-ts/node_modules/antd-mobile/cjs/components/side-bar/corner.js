"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Corner = void 0;

var _react = _interopRequireWildcard(require("react"));

var _nativeProps = require("../../utils/native-props");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Corner = (0, _react.memo)(props => (0, _nativeProps.withNativeProps)(props, _react.default.createElement("svg", {
  viewBox: '0 0 30 30'
}, _react.default.createElement("g", {
  stroke: 'none',
  strokeWidth: '1',
  fill: 'none',
  fillRule: 'evenodd'
}, _react.default.createElement("path", {
  d: 'M30,0 C13.4314575,3.04359188e-15 -2.02906125e-15,13.4314575 0,30 L0,30 L0,0 Z',
  fill: 'var(--adm-color-white)',
  transform: 'translate(15.000000, 15.000000) scale(-1, -1) translate(-15.000000, -15.000000) '
})))));
exports.Corner = Corner;