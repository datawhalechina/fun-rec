import React from 'react';
import classNames from 'classnames';
import { withNativeProps } from '../../utils/native-props';
const classPrefix = `adm-step`;
export const Step = props => {
  const {
    title,
    description,
    icon,
    status = 'wait'
  } = props;
  return withNativeProps(props, React.createElement("div", {
    className: classNames(`${classPrefix}`, `${classPrefix}-status-${status}`)
  }, React.createElement("div", {
    className: `${classPrefix}-indicator`
  }, React.createElement("div", {
    className: `${classPrefix}-icon-container`
  }, icon)), React.createElement("div", {
    className: `${classPrefix}-content`
  }, React.createElement("div", {
    className: `${classPrefix}-title`
  }, title), !!description && React.createElement("div", {
    className: `${classPrefix}-description`
  }, description))));
};