import React from 'react';
import classNames from 'classnames';
import { withNativeProps } from '../../utils/native-props';
const classPrefix = `adm-card`;
export const Card = props => {
  const renderHeader = () => {
    if (!(props.title || props.extra)) {
      return null;
    }

    return React.createElement("div", {
      className: classNames(`${classPrefix}-header`, props.headerClassName),
      style: props.headerStyle,
      onClick: props.onHeaderClick
    }, React.createElement("div", {
      className: `${classPrefix}-header-title`
    }, props.title), props.extra);
  };

  const renderBody = () => {
    if (!props.children) {
      return null;
    }

    return React.createElement("div", {
      className: classNames(`${classPrefix}-body`, props.bodyClassName),
      style: props.bodyStyle,
      onClick: props.onBodyClick
    }, props.children);
  };

  return withNativeProps(props, React.createElement("div", {
    className: classPrefix,
    onClick: props.onClick
  }, renderHeader(), renderBody()));
};