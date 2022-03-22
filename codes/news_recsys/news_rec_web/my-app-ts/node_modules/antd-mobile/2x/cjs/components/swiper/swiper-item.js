"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SwiperItem = void 0;

var _react = _interopRequireDefault(require("react"));

var _nativeProps = require("../../utils/native-props");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SwiperItem = props => {
  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    className: 'adm-swiper-item',
    onClick: props.onClick
  }, props.children));
};

exports.SwiperItem = SwiperItem;