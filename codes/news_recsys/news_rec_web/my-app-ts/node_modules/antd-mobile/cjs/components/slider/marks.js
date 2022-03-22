"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classPrefix = `adm-slider-mark`;

const Marks = ({
  marks,
  upperBound,
  lowerBound,
  max,
  min
}) => {
  const marksKeys = Object.keys(marks);
  const range = max - min;
  const elements = marksKeys.map(parseFloat).sort((a, b) => a - b).filter(point => point >= min && point <= max).map(point => {
    const markPoint = marks[point];

    if (!markPoint && markPoint !== 0) {
      return null;
    }

    const isActive = point <= upperBound && point >= lowerBound;
    const markClassName = (0, _classnames.default)({
      [`${classPrefix}-text`]: true,
      [`${classPrefix}-text-active`]: isActive
    });
    const style = {
      left: `${(point - min) / range * 100}%`
    };
    return _react.default.createElement("span", {
      className: markClassName,
      style: style,
      key: point
    }, markPoint);
  });
  return _react.default.createElement("div", {
    className: classPrefix
  }, elements);
};

var _default = Marks;
exports.default = _default;