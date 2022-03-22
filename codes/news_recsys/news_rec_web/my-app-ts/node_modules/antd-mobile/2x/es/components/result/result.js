import React from 'react';
import classNames from 'classnames';
import { CheckCircleFill, CloseCircleFill, InformationCircleFill, ClockCircleFill, ExclamationCircleFill } from 'antd-mobile-icons';
import { withNativeProps } from '../../utils/native-props';
const classPrefix = `adm-result`;
const iconRecord = {
  success: CheckCircleFill,
  error: CloseCircleFill,
  info: InformationCircleFill,
  waiting: ClockCircleFill,
  warning: ExclamationCircleFill
};
export const Result = props => {
  const {
    status,
    title,
    description,
    icon
  } = props;
  if (!status) return null;
  const resultIcon = icon || React.createElement(iconRecord[status]);
  return withNativeProps(props, React.createElement("div", {
    className: classNames(classPrefix, `${classPrefix}-${status}`)
  }, React.createElement("div", {
    className: `${classPrefix}-icon`
  }, resultIcon), React.createElement("div", {
    className: `${classPrefix}-title`
  }, title), description ? React.createElement("div", {
    className: `${classPrefix}-description`
  }, description) : null));
};