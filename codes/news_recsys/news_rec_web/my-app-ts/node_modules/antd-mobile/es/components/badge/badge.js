import classNames from 'classnames';
import React from 'react';
import { withNativeProps } from '../../utils/native-props';
const classPrefix = `adm-badge`;
export const dot = Symbol();
export const Badge = props => {
  const {
    content,
    color,
    children
  } = props;
  const isDot = content === dot;
  const badgeCls = classNames(classPrefix, !!children && `${classPrefix}-fixed`, isDot && `${classPrefix}-dot`, props.bordered && `${classPrefix}-bordered`);
  const element = content || content === 0 ? withNativeProps(props, React.createElement("div", {
    className: badgeCls,
    style: {
      '--color': color
    }
  }, !isDot && React.createElement("div", {
    className: `${classPrefix}-content`
  }, content))) : null;
  return children ? React.createElement("div", {
    className: `${classPrefix}-wrap`
  }, children, element) : element;
};