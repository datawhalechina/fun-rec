import React from 'react';
import classNames from 'classnames';
import Badge from '../badge';
import { withNativeProps } from '../../utils/native-props';
import { usePropsValue } from '../../utils/use-props-value';
import { Corner } from './corner';
const classPrefix = `adm-side-bar`;
export const SideBarItem = () => {
  return null;
};
export const SideBar = props => {
  var _a;

  let firstActiveKey = null;
  const items = [];
  React.Children.forEach(props.children, (child, index) => {
    if (!React.isValidElement(child)) return;
    const key = child.key;
    if (typeof key !== 'string') return;

    if (index === 0) {
      firstActiveKey = key;
    }

    items.push(child);
  });
  const [activeKey, setActiveKey] = usePropsValue({
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
  return withNativeProps(props, React.createElement("div", {
    className: classPrefix
  }, React.createElement("div", {
    className: `${classPrefix}-items`
  }, items.map((item, index) => {
    const active = item.key === activeKey;
    const isActiveNextSibling = items[index - 1] && items[index - 1].key === activeKey;
    const isActivePreviousSibling = items[index + 1] && items[index + 1].key === activeKey;
    return withNativeProps(item.props, React.createElement("div", {
      key: item.key,
      onClick: () => {
        const {
          key
        } = item;
        if (key === undefined || key === null || item.props.disabled) return;
        setActiveKey(key.toString());
      },
      className: classNames(`${classPrefix}-item`, {
        [`${classPrefix}-item-active`]: active,
        [`${classPrefix}-item-disabled`]: item.props.disabled
      })
    }, React.createElement(React.Fragment, null, isActiveNextSibling && React.createElement(Corner, {
      className: `${classPrefix}-item-corner ${classPrefix}-item-corner-top`
    }), isActivePreviousSibling && React.createElement(Corner, {
      className: `${classPrefix}-item-corner ${classPrefix}-item-corner-bottom`
    })), React.createElement(Badge, {
      content: item.props.badge,
      className: `${classPrefix}-badge`
    }, React.createElement("div", {
      className: `${classPrefix}-item-title`
    }, active && React.createElement("div", {
      className: `${classPrefix}-item-highlight`
    }), item.props.title))));
  })), React.createElement("div", {
    className: classNames(`${classPrefix}-extra-space`, isLastItemActive && `${classPrefix}-item-active-next-sibling`)
  }, isLastItemActive && React.createElement(Corner, {
    className: `${classPrefix}-item-corner ${classPrefix}-item-corner-top`
  }))));
};