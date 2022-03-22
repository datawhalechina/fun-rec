import React from 'react';
import classNames from 'classnames';
import { withNativeProps } from '../../utils/native-props';
import { EmptyIcon } from './empty-icon';
const classPrefix = `adm-empty`;
export const Empty = props => {
  function renderImageNode() {
    const {
      image
    } = props;

    if (image === undefined) {
      return React.createElement(EmptyIcon, {
        className: `${classPrefix}-image`,
        style: props.imageStyle
      });
    }

    if (typeof image === 'string') {
      return React.createElement("img", {
        className: `${classPrefix}-image`,
        style: props.imageStyle,
        src: image,
        alt: 'empty'
      });
    }

    return image;
  }

  return withNativeProps(props, React.createElement("div", {
    className: classPrefix
  }, React.createElement("div", {
    className: `${classPrefix}-image-container`
  }, renderImageNode()), props.description && React.createElement("div", {
    className: classNames(`${classPrefix}-description`)
  }, props.description)));
};