import classNames from 'classnames';
import React, { useState, useRef } from 'react';
import { useUnmountedRef } from 'ahooks';
import { withNativeProps } from '../../utils/native-props';
import { mergeProps } from '../../utils/with-default-props';
import Mask from '../mask';
import { useLockScroll } from '../../utils/use-lock-scroll';
import { renderToContainer } from '../../utils/render-to-container';
import { useSpring, animated } from '@react-spring/web';
import { useShouldRender } from '../../utils/should-render';
import { withStopPropagation } from '../../utils/with-stop-propagation';
const classPrefix = `adm-popup`;
const defaultProps = {
  position: 'bottom',
  visible: false,
  getContainer: () => document.body,
  mask: true,
  stopPropagation: ['click']
};
export const Popup = p => {
  const props = mergeProps(defaultProps, p);
  const bodyCls = classNames(`${classPrefix}-body`, props.bodyClassName, `${classPrefix}-body-position-${props.position}`);
  const ref = useRef(null);
  const [active, setActive] = useState(props.visible);
  useLockScroll(ref, active);
  const shouldRender = useShouldRender(active, props.forceRender, props.destroyOnClose);
  const unmountedRef = useUnmountedRef();
  const {
    percent
  } = useSpring({
    percent: props.visible ? 0 : 100,
    config: {
      precision: 0.1,
      mass: 0.4,
      tension: 300,
      friction: 30
    },
    onStart: () => {
      setActive(true);
    },
    onRest: () => {
      var _a, _b;

      if (unmountedRef.current) return;
      setActive(props.visible);

      if (props.visible) {
        (_a = props.afterShow) === null || _a === void 0 ? void 0 : _a.call(props);
      } else {
        (_b = props.afterClose) === null || _b === void 0 ? void 0 : _b.call(props);
      }
    }
  });
  const node = withStopPropagation(props.stopPropagation, withNativeProps(props, React.createElement("div", {
    className: classPrefix,
    onClick: props.onClick,
    style: {
      display: active ? 'unset' : 'none'
    }
  }, props.mask && React.createElement(Mask, {
    visible: props.visible,
    onMaskClick: props.onMaskClick,
    className: props.maskClassName,
    style: props.maskStyle,
    disableBodyScroll: false,
    stopPropagation: props.stopPropagation
  }), React.createElement(animated.div, {
    className: bodyCls,
    style: Object.assign(Object.assign({}, props.bodyStyle), {
      transform: percent.to(v => {
        if (props.position === 'bottom') {
          return `translate(0, ${v}%)`;
        }

        if (props.position === 'top') {
          return `translate(0, -${v}%)`;
        }

        if (props.position === 'left') {
          return `translate(-${v}%, 0)`;
        }

        if (props.position === 'right') {
          return `translate(${v}%, 0)`;
        }

        return 'none';
      })
    }),
    ref: ref
  }, shouldRender && props.children))));
  return renderToContainer(props.getContainer, node);
};