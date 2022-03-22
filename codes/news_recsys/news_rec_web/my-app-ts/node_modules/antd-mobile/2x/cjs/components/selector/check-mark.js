"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CheckMark = void 0;

var _react = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const CheckMark = (0, _react.memo)(() => {
  return _react.default.createElement("svg", {
    width: '17px',
    height: '13px',
    viewBox: '0 0 17 13',
    version: '1.1',
    xmlns: 'http://www.w3.org/2000/svg'
  }, _react.default.createElement("g", {
    stroke: 'none',
    strokeWidth: '1',
    fill: 'none',
    fillRule: 'evenodd',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  }, _react.default.createElement("g", {
    transform: 'translate(-2832.000000, -1103.000000)',
    stroke: '#FFFFFF',
    strokeWidth: '3'
  }, _react.default.createElement("g", {
    transform: 'translate(2610.000000, 955.000000)'
  }, _react.default.createElement("g", {
    transform: 'translate(24.000000, 91.000000)'
  }, _react.default.createElement("g", {
    transform: 'translate(179.177408, 36.687816)'
  }, _react.default.createElement("polyline", {
    points: '34.2767388 22 24.797043 31.4796958 21 27.6826527'
  })))))));
});
exports.CheckMark = CheckMark;