import React from 'react';
import classNames from 'classnames';
import { LeftOutline } from 'antd-mobile-icons';
import { withNativeProps } from '../../utils/native-props';
import { mergeProps } from '../../utils/with-default-props';
const classPrefix = `adm-nav-bar`;
const defaultProps = {
  back: '',
  backArrow: true
};
export const NavBar = p => {
  const props = mergeProps(defaultProps, p);
  const {
    back,
    backArrow
  } = props;
  return withNativeProps(props, React.createElement("div", {
    className: classNames(classPrefix)
  }, React.createElement("div", {
    className: `${classPrefix}-left`,
    role: 'button'
  }, back !== null && React.createElement("div", {
    className: `${classPrefix}-back`,
    onClick: props.onBack
  }, backArrow && React.createElement("span", {
    className: `${classPrefix}-back-arrow`
  }, backArrow === true ? React.createElement(LeftOutline, null) : backArrow), React.createElement("span", {
    "aria-hidden": 'true'
  }, back)), props.left), React.createElement("div", {
    className: `${classPrefix}-title`
  }, props.children), React.createElement("div", {
    className: `${classPrefix}-right`
  }, props.right)));
};