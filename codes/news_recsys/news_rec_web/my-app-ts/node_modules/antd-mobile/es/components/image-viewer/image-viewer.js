import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { mergeProps } from '../../utils/with-default-props';
import { renderToContainer } from '../../utils/render-to-container';
import Mask from '../mask';
import { Slide } from './slide';
import { Slides } from './slides';
const classPrefix = `adm-image-viewer`;
const defaultProps = {
  maxZoom: 3,
  getContainer: null,
  visible: false
};
export const ImageViewer = p => {
  const props = mergeProps(defaultProps, p);
  const node = React.createElement(Mask, {
    visible: props.visible,
    disableBodyScroll: false,
    opacity: 'thick',
    afterClose: props.afterClose
  }, React.createElement("div", {
    className: `${classPrefix}-content`
  }, props.image && React.createElement(Slide, {
    image: props.image,
    onTap: () => {
      var _a;

      (_a = props.onClose) === null || _a === void 0 ? void 0 : _a.call(props);
    },
    maxZoom: props.maxZoom
  })));
  return renderToContainer(props.getContainer, node);
};
const multiDefaultProps = Object.assign(Object.assign({}, defaultProps), {
  defaultIndex: 0
});
export const MultiImageViewer = forwardRef((p, ref) => {
  const props = mergeProps(multiDefaultProps, p);
  const [defaultIndex, setDefaultIndex] = useState(props.defaultIndex);
  const slidesRef = useRef(null);
  useImperativeHandle(ref, () => ({
    swipeTo: (index, immediate) => {
      var _a;

      setDefaultIndex(index);
      (_a = slidesRef.current) === null || _a === void 0 ? void 0 : _a.swipeTo(index, immediate);
    }
  }));
  const node = React.createElement(Mask, {
    visible: props.visible,
    disableBodyScroll: false,
    opacity: 'thick',
    afterClose: props.afterClose
  }, React.createElement("div", {
    className: `${classPrefix}-content`
  }, props.images && React.createElement(Slides, {
    ref: slidesRef,
    defaultIndex: defaultIndex,
    onIndexChange: props.onIndexChange,
    images: props.images,
    onTap: () => {
      var _a;

      (_a = props.onClose) === null || _a === void 0 ? void 0 : _a.call(props);
    },
    maxZoom: props.maxZoom
  })));
  return renderToContainer(props.getContainer, node);
});