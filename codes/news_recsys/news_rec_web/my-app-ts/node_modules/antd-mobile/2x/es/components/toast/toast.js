import React, { useMemo } from 'react';
import classNames from 'classnames';
import { CheckOutline, CloseOutline } from 'antd-mobile-icons';
import Mask from '../mask';
import { mergeProps } from '../../utils/with-default-props';
import AutoCenter from '../auto-center';
import SpinLoading from '../spin-loading';
const classPrefix = `adm-toast`;
const defaultProps = {
  maskClickable: true,
  stopPropagation: ['click']
};
export const InternalToast = p => {
  const props = mergeProps(defaultProps, p);
  const {
    maskClickable,
    content,
    icon,
    position
  } = props;
  const iconElement = useMemo(() => {
    if (icon === null || icon === undefined) return null;

    switch (icon) {
      case 'success':
        return React.createElement(CheckOutline, null);

      case 'fail':
        return React.createElement(CloseOutline, null);

      case 'loading':
        return React.createElement(SpinLoading, {
          color: 'white',
          className: `${classPrefix}-loading`
        });

      default:
        return icon;
    }
  }, [icon]);
  const top = useMemo(() => {
    switch (position) {
      case 'top':
        return '20%';

      case 'bottom':
        return '80%';

      default:
        return '50%';
    }
  }, [position]);
  return React.createElement(Mask, {
    visible: props.visible,
    destroyOnClose: true,
    opacity: 0,
    disableBodyScroll: !maskClickable,
    getContainer: props.getContainer,
    afterClose: props.afterClose,
    style: Object.assign({
      pointerEvents: maskClickable ? 'none' : 'auto'
    }, props.maskStyle),
    className: classNames(`${classPrefix}-mask`, props.maskClassName),
    stopPropagation: props.stopPropagation
  }, React.createElement("div", {
    className: classNames(`${classPrefix}-wrap`)
  }, React.createElement("div", {
    style: {
      top
    },
    className: classNames(`${classPrefix}-main`, icon ? `${classPrefix}-main-icon` : `${classPrefix}-main-text`)
  }, iconElement && React.createElement("div", {
    className: `${classPrefix}-icon`
  }, iconElement), React.createElement(AutoCenter, null, content))));
};