import React from 'react';
import { withNativeProps } from '../../utils/native-props';
import { Image } from '../../index';
import { mergeProps } from '../../utils/with-default-props';
import { Fallback } from './fallback';
const classPrefix = 'adm-avatar';
const defaultProps = {
  fallback: React.createElement(Fallback, null),
  fit: 'cover'
};
export const Avatar = p => {
  const props = mergeProps(defaultProps, p);
  return withNativeProps(props, React.createElement(Image, {
    className: classPrefix,
    src: props.src,
    fallback: props.fallback,
    placeholder: props.fallback,
    alt: props.alt,
    lazy: props.lazy,
    fit: props.fit,
    onClick: props.onClick,
    onError: props.onError
  }));
};