"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SkeletonTitle = exports.SkeletonParagraph = exports.Skeleton = void 0;

var _react = _interopRequireDefault(require("react"));

var _nativeProps = require("../../utils/native-props");

var _classnames = _interopRequireDefault(require("classnames"));

var _generateIntArray = require("../../utils/generate-int-array");

var _withDefaultProps = require("../../utils/with-default-props");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classPrefix = 'adm-skeleton';

const Skeleton = props => {
  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    className: (0, _classnames.default)(classPrefix, {
      [`${classPrefix}-animated`]: props.animated
    })
  }));
};

exports.Skeleton = Skeleton;

const SkeletonTitle = props => {
  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement(Skeleton, {
    animated: props.animated,
    className: `${classPrefix}-title`
  }));
};

exports.SkeletonTitle = SkeletonTitle;
const defaultSkeletonParagraphProps = {
  lineCount: 3
};

const SkeletonParagraph = p => {
  const props = (0, _withDefaultProps.mergeProps)(defaultSkeletonParagraphProps, p);
  const keys = (0, _generateIntArray.generateIntArray)(1, props.lineCount);

  const node = _react.default.createElement("div", {
    className: `${classPrefix}-paragraph`
  }, keys.map(key => _react.default.createElement(Skeleton, {
    key: key,
    animated: props.animated,
    className: `${classPrefix}-paragraph-line`
  })));

  return (0, _nativeProps.withNativeProps)(props, node);
};

exports.SkeletonParagraph = SkeletonParagraph;