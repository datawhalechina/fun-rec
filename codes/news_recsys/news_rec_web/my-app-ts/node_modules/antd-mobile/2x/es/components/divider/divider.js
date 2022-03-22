import React from 'react';
import classNames from 'classnames';
import { withNativeProps } from '../../utils/native-props';
import { mergeProps } from '../../utils/with-default-props';
const classPrefix = `adm-divider`;
const defaultProps = {
  contentPosition: 'center'
};
export const Divider = p => {
  const props = mergeProps(defaultProps, p);
  return withNativeProps(props, React.createElement("div", {
    className: classNames(classPrefix, `${classPrefix}-${props.contentPosition}`)
  }, props.children && React.createElement("div", {
    className: `${classPrefix}-content`
  }, props.children)));
};