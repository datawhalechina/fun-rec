"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridItem = exports.Grid = void 0;

var _withDefaultProps = require("../../utils/with-default-props");

var _react = _interopRequireDefault(require("react"));

var _nativeProps = require("../../utils/native-props");

var _toCssLength = require("../../utils/to-css-length");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classPrefix = `adm-grid`;

const Grid = props => {
  const style = {
    '--columns': props.columns.toString()
  };
  const {
    gap
  } = props;

  if (gap !== undefined) {
    if (Array.isArray(gap)) {
      style['--gap-horizontal'] = (0, _toCssLength.toCSSLength)(gap[0]);
      style['--gap-vertical'] = (0, _toCssLength.toCSSLength)(gap[1]);
    } else {
      style['--gap'] = (0, _toCssLength.toCSSLength)(gap);
    }
  }

  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    className: classPrefix,
    style: style
  }, props.children));
};

exports.Grid = Grid;

const GridItem = p => {
  const props = (0, _withDefaultProps.mergeProps)({
    span: 1
  }, p);
  const itemStyle = {
    '--item-span': props.span
  };
  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    className: `${classPrefix}-item`,
    style: itemStyle,
    onClick: props.onClick
  }, props.children));
};

exports.GridItem = GridItem;