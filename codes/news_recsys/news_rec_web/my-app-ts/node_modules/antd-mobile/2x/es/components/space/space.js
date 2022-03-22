import React from 'react';
import classNames from 'classnames';
import { withNativeProps } from '../../utils/native-props';
import { mergeProps } from '../../utils/with-default-props';
const classPrefix = `adm-space`;
const defaultProps = {
  direction: 'horizontal'
};
export const Space = p => {
  const props = mergeProps(defaultProps, p);
  const {
    direction,
    onClick
  } = props;
  return withNativeProps(props, React.createElement("div", {
    className: classNames(classPrefix, {
      [`${classPrefix}-wrap`]: props.wrap,
      [`${classPrefix}-block`]: props.block,
      [`${classPrefix}-${direction}`]: true,
      [`${classPrefix}-align-${props.align}`]: !!props.align,
      [`${classPrefix}-justify-${props.justify}`]: !!props.justify
    }),
    onClick: onClick
  }, React.Children.map(props.children, child => {
    return child !== null && child !== undefined && React.createElement("div", {
      className: `${classPrefix}-item`
    }, child);
  })));
};