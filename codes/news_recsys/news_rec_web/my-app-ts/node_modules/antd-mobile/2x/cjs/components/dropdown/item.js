"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ItemChildrenWrap = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var _react = _interopRequireDefault(require("react"));

var _nativeProps = require("../../utils/native-props");

var _shouldRender = require("../../utils/should-render");

var _antdMobileIcons = require("antd-mobile-icons");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classPrefix = `adm-dropdown-item`;

const Item = props => {
  var _a;

  const cls = (0, _classnames.default)(classPrefix, {
    [`${classPrefix}-active`]: props.active,
    [`${classPrefix}-highlight`]: (_a = props.highlight) !== null && _a !== void 0 ? _a : props.active
  });
  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    className: cls,
    onClick: props.onClick
  }, _react.default.createElement("div", {
    className: `${classPrefix}-title`
  }, _react.default.createElement("span", {
    className: `${classPrefix}-title-text`
  }, props.title), _react.default.createElement("span", {
    className: (0, _classnames.default)(`${classPrefix}-title-arrow`, {
      [`${classPrefix}-title-arrow-active`]: props.active
    })
  }, props.arrow === undefined ? _react.default.createElement(_antdMobileIcons.DownFill, null) : props.arrow))));
};

var _default = Item;
exports.default = _default;

const ItemChildrenWrap = props => {
  const {
    active = false
  } = props;
  const shouldRender = (0, _shouldRender.useShouldRender)(active, props.forceRender, props.destroyOnClose);
  const cls = (0, _classnames.default)(`${classPrefix}-content`, {
    [`${classPrefix}-content-hidden`]: !active
  });
  return shouldRender ? _react.default.createElement("div", {
    className: cls,
    onClick: props.onClick
  }, props.children) : null;
};

exports.ItemChildrenWrap = ItemChildrenWrap;