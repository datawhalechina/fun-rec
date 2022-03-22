"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Empty = void 0;

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _nativeProps = require("../../utils/native-props");

var _emptyIcon = require("./empty-icon");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classPrefix = `adm-empty`;

const Empty = props => {
  function renderImageNode() {
    const {
      image
    } = props;

    if (image === undefined) {
      return _react.default.createElement(_emptyIcon.EmptyIcon, {
        className: `${classPrefix}-image`,
        style: props.imageStyle
      });
    }

    if (typeof image === 'string') {
      return _react.default.createElement("img", {
        className: `${classPrefix}-image`,
        style: props.imageStyle,
        src: image,
        alt: 'empty'
      });
    }

    return image;
  }

  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    className: classPrefix
  }, _react.default.createElement("div", {
    className: `${classPrefix}-image-container`
  }, renderImageNode()), props.description && _react.default.createElement("div", {
    className: (0, _classnames.default)(`${classPrefix}-description`)
  }, props.description)));
};

exports.Empty = Empty;