"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SideBarItem = exports.SideBar = void 0;

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _badge = _interopRequireDefault(require("../badge"));

var _nativeProps = require("../../utils/native-props");

var _usePropsValue = require("../../utils/use-props-value");

var _corner = require("./corner");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classPrefix = `adm-side-bar`;

const SideBarItem = () => {
  return null;
};

exports.SideBarItem = SideBarItem;

const SideBar = props => {
  var _a;

  let firstActiveKey = null;
  const items = [];

  _react.default.Children.forEach(props.children, (child, index) => {
    if (!_react.default.isValidElement(child)) return;
    const key = child.key;
    if (typeof key !== 'string') return;

    if (index === 0) {
      firstActiveKey = key;
    }

    items.push(child);
  });

  const [activeKey, setActiveKey] = (0, _usePropsValue.usePropsValue)({
    value: props.activeKey,
    defaultValue: (_a = props.defaultActiveKey) !== null && _a !== void 0 ? _a : firstActiveKey,
    onChange: v => {
      var _a;

      if (v === null) return;
      (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, v);
    }
  });
  const lastItem = items[items.length - 1];
  const isLastItemActive = lastItem && lastItem.key === activeKey;
  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    className: classPrefix
  }, _react.default.createElement("div", {
    className: `${classPrefix}-items`
  }, items.map((item, index) => {
    const active = item.key === activeKey;
    const isActiveNextSibling = items[index - 1] && items[index - 1].key === activeKey;
    const isActivePreviousSibling = items[index + 1] && items[index + 1].key === activeKey;
    return (0, _nativeProps.withNativeProps)(item.props, _react.default.createElement("div", {
      key: item.key,
      onClick: () => {
        const {
          key
        } = item;
        if (key === undefined || key === null || item.props.disabled) return;
        setActiveKey(key.toString());
      },
      className: (0, _classnames.default)(`${classPrefix}-item`, {
        [`${classPrefix}-item-active`]: active,
        [`${classPrefix}-item-disabled`]: item.props.disabled
      })
    }, _react.default.createElement(_react.default.Fragment, null, isActiveNextSibling && _react.default.createElement(_corner.Corner, {
      className: `${classPrefix}-item-corner ${classPrefix}-item-corner-top`
    }), isActivePreviousSibling && _react.default.createElement(_corner.Corner, {
      className: `${classPrefix}-item-corner ${classPrefix}-item-corner-bottom`
    })), _react.default.createElement(_badge.default, {
      content: item.props.badge,
      className: `${classPrefix}-badge`
    }, _react.default.createElement("div", {
      className: `${classPrefix}-item-title`
    }, active && _react.default.createElement("div", {
      className: `${classPrefix}-item-highlight`
    }), item.props.title))));
  })), _react.default.createElement("div", {
    className: (0, _classnames.default)(`${classPrefix}-extra-space`, isLastItemActive && `${classPrefix}-item-active-next-sibling`)
  }, isLastItemActive && _react.default.createElement(_corner.Corner, {
    className: `${classPrefix}-item-corner ${classPrefix}-item-corner-top`
  }))));
};

exports.SideBar = SideBar;