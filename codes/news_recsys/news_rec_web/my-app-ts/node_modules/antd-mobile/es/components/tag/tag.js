import React from 'react';
import { mergeProps } from '../../utils/with-default-props';
import { withNativeProps } from '../../utils/native-props';
import classNames from 'classnames';
const classPrefix = `adm-tag`;
const colorRecord = {
  default: '#666666',
  primary: 'var(--adm-color-primary, #1677ff)',
  success: 'var(--adm-color-success, #00b578)',
  warning: 'var(--adm-color-warning, #ff8f1f)',
  danger: 'var(--adm-color-danger, #ff3141)'
};
const defaultProps = {
  color: 'default',
  fill: 'solid',
  round: false
};
export const Tag = p => {
  var _a;

  const props = mergeProps(defaultProps, p);
  const color = (_a = colorRecord[props.color]) !== null && _a !== void 0 ? _a : props.color;
  const style = {
    '--border-color': color,
    '--text-color': props.fill === 'outline' ? color : '#ffffff',
    '--background-color': props.fill === 'outline' ? 'transparent' : color
  };
  return withNativeProps(props, React.createElement("span", {
    style: style,
    onClick: props.onClick,
    className: classNames(classPrefix, {
      [`${classPrefix}-round`]: props.round
    })
  }, props.children));
};