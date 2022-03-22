import React from 'react';
import classNames from 'classnames';
import { withNativeProps } from '../../utils/native-props';
import { mergeProps } from '../../utils/with-default-props';
const classPrefix = `adm-list`;
const defaultProps = {
  mode: 'default'
};
export const List = p => {
  const props = mergeProps(defaultProps, p);
  return withNativeProps(props, React.createElement("div", {
    className: classNames(classPrefix, `${classPrefix}-${props.mode}`)
  }, props.header && React.createElement("div", {
    className: `${classPrefix}-header`
  }, props.header), React.createElement("div", {
    className: `${classPrefix}-body`
  }, React.createElement("div", {
    className: `${classPrefix}-body-inner`
  }, props.children))));
};