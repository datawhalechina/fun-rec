"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageIndicator = void 0;

var _react = _interopRequireWildcard(require("react"));

var _nativeProps = require("../../utils/native-props");

var _classnames = _interopRequireDefault(require("classnames"));

var _withDefaultProps = require("../../utils/with-default-props");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const classPrefix = `adm-page-indicator`;
const defaultProps = {
  color: 'primary',
  direction: 'horizontal'
};
const PageIndicator = (0, _react.memo)(p => {
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, p);
  const dots = [];

  for (let i = 0; i < props.total; i++) {
    dots.push(_react.default.createElement("div", {
      key: i,
      className: (0, _classnames.default)(`${classPrefix}-dot`, {
        [`${classPrefix}-dot-active`]: props.current === i
      })
    }));
  }

  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    className: (0, _classnames.default)(classPrefix, `${classPrefix}-${props.direction}`, `${classPrefix}-color-${props.color}`)
  }, dots));
});
exports.PageIndicator = PageIndicator;