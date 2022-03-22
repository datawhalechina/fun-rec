import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useDrag } from '@use-gesture/react';
import { useSpring, animated } from '@react-spring/web';
import { Slide } from './slide';
import { convertPx } from '../../utils/convert-px';
import { bound } from '../../utils/bound';
const classPrefix = `adm-image-viewer`;
export const Slides = forwardRef((props, ref) => {
  const slideWidth = window.innerWidth + convertPx(16);
  const [{
    x
  }, api] = useSpring(() => ({
    x: props.defaultIndex * slideWidth,
    config: {
      tension: 250,
      clamp: true
    }
  }));
  const count = props.images.length;

  function swipeTo(index, immediate = false) {
    var _a;

    const i = bound(index, 0, count - 1);
    (_a = props.onIndexChange) === null || _a === void 0 ? void 0 : _a.call(props, i);
    api.start({
      x: i * slideWidth,
      immediate
    });
  }

  useImperativeHandle(ref, () => ({
    swipeTo
  }));
  const dragLockRef = useRef(false);
  const bind = useDrag(state => {
    if (dragLockRef.current) return;
    const [offsetX] = state.offset;

    if (state.last) {
      const minIndex = Math.floor(offsetX / slideWidth);
      const maxIndex = minIndex + 1;
      const velocityOffset = Math.min(state.velocity[0] * 2000, slideWidth) * state.direction[0];
      swipeTo(bound(Math.round((offsetX + velocityOffset) / slideWidth), minIndex, maxIndex));
    } else {
      api.start({
        x: offsetX,
        immediate: true
      });
    }
  }, {
    transform: ([x, y]) => [-x, y],
    from: () => [x.get(), 0],
    bounds: () => {
      return {
        left: 0,
        right: (count - 1) * slideWidth
      };
    },
    rubberband: true,
    axis: 'x',
    pointer: {
      touch: true
    }
  });
  return React.createElement("div", Object.assign({
    className: `${classPrefix}-slides`
  }, bind()), React.createElement(animated.div, {
    className: `${classPrefix}-indicator`
  }, x.to(v => {
    const index = bound(Math.round(v / slideWidth), 0, count - 1);
    return `${index + 1} / ${count}`;
  })), React.createElement(animated.div, {
    className: `${classPrefix}-slides-inner`,
    style: {
      x: x.to(x => -x)
    }
  }, props.images.map(image => React.createElement(Slide, {
    key: image,
    image: image,
    onTap: props.onTap,
    maxZoom: props.maxZoom,
    onZoomChange: zoom => {
      if (zoom !== 1) {
        const index = Math.round(x.get() / slideWidth);
        api.start({
          x: index * slideWidth
        });
      }
    },
    dragLockRef: dragLockRef
  }))));
});