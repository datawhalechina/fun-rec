import React, { useState, useRef, memo } from 'react';
import classNames from 'classnames';
import { CloseOutline, SoundOutline } from 'antd-mobile-icons';
import { useTimeout } from 'ahooks';
import { mergeProps } from '../../utils/with-default-props';
import { withNativeProps } from '../../utils/native-props';
import { useResizeEffect } from '../../utils/use-resize-effect';
import { useMutationEffect } from '../../utils/use-mutation-effect';
const classPrefix = `adm-notice-bar`;
const defaultProps = {
  color: 'default',
  delay: 2000,
  speed: 50,
  icon: React.createElement(SoundOutline, null)
};
export const NoticeBar = memo(p => {
  const props = mergeProps(defaultProps, p);
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const speed = props.speed;
  const delayLockRef = useRef(true);
  const animatingRef = useRef(false);

  function start() {
    if (delayLockRef.current) return;
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    if (container.offsetWidth >= text.offsetWidth) {
      animatingRef.current = false;
      text.style.removeProperty('transition-duration');
      text.style.removeProperty('transform');
      return;
    }

    if (animatingRef.current) return;
    const initial = !text.style.transform;
    text.style.transitionDuration = '0s';

    if (initial) {
      text.style.transform = 'translateX(0)';
    } else {
      text.style.transform = `translateX(${container.offsetWidth}px)`;
    }

    const distance = initial ? text.offsetWidth : container.offsetWidth + text.offsetWidth;
    animatingRef.current = true;
    text.style.transitionDuration = `${Math.round(distance / speed)}s`;
    text.style.transform = `translateX(-${text.offsetWidth}px)`;
  }

  useTimeout(() => {
    delayLockRef.current = false;
    start();
  }, props.delay);
  useResizeEffect(() => {
    start();
  }, containerRef);
  useMutationEffect(() => {
    start();
  }, textRef, {
    subtree: true,
    childList: true,
    characterData: true
  });
  if (!visible) return null;
  return withNativeProps(props, React.createElement("div", {
    className: classNames(classPrefix, `${classPrefix}-${props.color}`)
  }, props.icon && React.createElement("span", {
    className: `${classPrefix}-left`
  }, props.icon), React.createElement("span", {
    ref: containerRef,
    className: `${classPrefix}-content`
  }, React.createElement("span", {
    onTransitionEnd: () => {
      animatingRef.current = false;
      start();
    },
    ref: textRef,
    className: `${classPrefix}-content-inner`
  }, props.content)), (props.closeable || props.extra) && React.createElement("span", {
    className: `${classPrefix}-right`
  }, props.extra, props.closeable && React.createElement(CloseOutline, {
    className: `${classPrefix}-close-icon`,
    onClick: () => {
      var _a;

      setVisible(false);
      (_a = props.onClose) === null || _a === void 0 ? void 0 : _a.call(props);
    }
  }))));
});