import { mergeProps } from '../../utils/with-default-props';
import React from 'react';
import { withNativeProps } from '../../utils/native-props';
import { toCSSLength } from '../../utils/to-css-length';
const classPrefix = `adm-grid`;
export const Grid = props => {
  const style = {
    '--columns': props.columns.toString()
  };
  const {
    gap
  } = props;

  if (gap !== undefined) {
    if (Array.isArray(gap)) {
      style['--gap-horizontal'] = toCSSLength(gap[0]);
      style['--gap-vertical'] = toCSSLength(gap[1]);
    } else {
      style['--gap'] = toCSSLength(gap);
    }
  }

  return withNativeProps(props, React.createElement("div", {
    className: classPrefix,
    style: style
  }, props.children));
};
export const GridItem = p => {
  const props = mergeProps({
    span: 1
  }, p);
  const itemStyle = {
    '--item-span': props.span
  };
  return withNativeProps(props, React.createElement("div", {
    className: `${classPrefix}-item`,
    style: itemStyle,
    onClick: props.onClick
  }, props.children));
};