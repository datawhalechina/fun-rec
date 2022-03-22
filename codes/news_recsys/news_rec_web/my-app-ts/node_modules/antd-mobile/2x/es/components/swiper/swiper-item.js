import React from 'react';
import { withNativeProps } from '../../utils/native-props';
export const SwiperItem = props => {
  return withNativeProps(props, React.createElement("div", {
    className: 'adm-swiper-item',
    onClick: props.onClick
  }, props.children));
};