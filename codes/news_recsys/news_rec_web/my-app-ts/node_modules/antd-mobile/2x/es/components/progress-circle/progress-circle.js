import React from 'react';
import { withNativeProps } from '../../utils/native-props';
import { mergeProps } from '../../utils/with-default-props';
const classPrefix = `adm-progress-circle`;
export const ProgressCircle = p => {
  const props = mergeProps({
    percent: 0
  }, p);
  const style = {
    '--percent': props.percent.toString()
  };
  return withNativeProps(props, React.createElement("div", {
    className: `${classPrefix}`,
    style: style
  }, React.createElement("div", {
    className: `${classPrefix}-content`
  }, React.createElement("svg", {
    className: `${classPrefix}-svg`
  }, React.createElement("circle", {
    className: `${classPrefix}-track`,
    fill: 'transparent'
  }), React.createElement("circle", {
    className: `${classPrefix}-fill`,
    fill: 'transparent'
  })), React.createElement("div", {
    className: `${classPrefix}-info`
  }, props.children))));
};