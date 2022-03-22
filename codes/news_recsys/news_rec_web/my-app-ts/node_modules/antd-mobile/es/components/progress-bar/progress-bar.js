import React from 'react';
import { withNativeProps } from '../../utils/native-props';
import { mergeProps } from '../../utils/with-default-props';
const classPrefix = `adm-progress-bar`;
export const ProgressBar = p => {
  const props = mergeProps({
    percent: 0
  }, p);
  const fillStyle = {
    width: `${props.percent}%`
  };
  return withNativeProps(props, React.createElement("div", {
    className: classPrefix
  }, React.createElement("div", {
    className: `${classPrefix}-trail`
  }, React.createElement("div", {
    className: `${classPrefix}-fill`,
    style: fillStyle
  }))));
};