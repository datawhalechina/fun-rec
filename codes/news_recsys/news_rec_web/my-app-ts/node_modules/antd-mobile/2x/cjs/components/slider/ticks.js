"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classPrefix = `adm-slider`;

const Ticks = ({
  points,
  max,
  min,
  upperBound,
  lowerBound
}) => {
  const range = max - min;
  const elements = points.map(point => {
    const offset = `${Math.abs(point - min) / range * 100}%`;
    const isActived = point <= upperBound && point >= lowerBound;
    const style = {
      left: offset
    };
    const pointClassName = (0, _classnames.default)({
      [`${classPrefix}-tick`]: true,
      [`${classPrefix}-tick-active`]: isActived
    });
    return _react.default.createElement("span", {
      className: pointClassName,
      style: style,
      key: point
    });
  });
  return _react.default.createElement("div", {
    className: `${classPrefix}-ticks`
  }, elements);
};

var _default = Ticks;
exports.default = _default;