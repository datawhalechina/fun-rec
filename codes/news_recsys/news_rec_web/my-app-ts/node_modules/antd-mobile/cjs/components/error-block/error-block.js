"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorBlock = void 0;

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _withDefaultProps = require("../../utils/with-default-props");

var _nativeProps = require("../../utils/native-props");

var _configProvider = require("../config-provider");

var _images = require("./images");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classPrefix = `adm-error-block`;
const defaultProps = {
  status: 'default'
};

const ErrorBlock = p => {
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, p);
  const {
    locale
  } = (0, _configProvider.useConfig)();
  const contentPack = locale.ErrorBlock[props.status];
  const des = 'description' in props ? props.description : contentPack.description;
  const title = 'title' in props ? props.title : contentPack.title;
  let imageNode = _images.imageRecord[props.status];

  if (props.image) {
    if (typeof props.image === 'string') {
      imageNode = _react.default.createElement("img", {
        src: props.image,
        alt: 'error block image'
      });
    } else {
      imageNode = props.image;
    }
  }

  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    className: (0, _classnames.default)(classPrefix, {
      [`${classPrefix}-full-page`]: props.fullPage
    })
  }, _react.default.createElement("div", {
    className: `${classPrefix}-image`
  }, imageNode), _react.default.createElement("div", {
    className: `${classPrefix}-description`
  }, title && _react.default.createElement("div", {
    className: `${classPrefix}-description-title`
  }, title), des && _react.default.createElement("div", {
    className: `${classPrefix}-description-subtitle`
  }, des)), props.children && _react.default.createElement("div", {
    className: `${classPrefix}-content`
  }, props.children)));
};

exports.ErrorBlock = ErrorBlock;