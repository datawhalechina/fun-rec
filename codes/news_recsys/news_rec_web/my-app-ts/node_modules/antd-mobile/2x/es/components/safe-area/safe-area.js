import { withNativeProps } from '../../utils/native-props';
import React from 'react';
import classNames from 'classnames';
const classPrefix = 'adm-safe-area';
export const SafeArea = props => {
  return withNativeProps(props, React.createElement("div", {
    className: classNames(classPrefix, `${classPrefix}-position-${props.position}`)
  }));
};