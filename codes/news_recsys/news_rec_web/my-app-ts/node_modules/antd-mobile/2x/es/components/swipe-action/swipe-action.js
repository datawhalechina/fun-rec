import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { mergeProps } from '../../utils/with-default-props';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import Button from '../button';
import { nearest } from '../../utils/nearest';
import { withNativeProps } from '../../utils/native-props';
const defaultProps = {
  rightActions: [],
  leftActions: [],
  closeOnTouchOutside: true,
  closeOnAction: true
};
export const SwipeAction = forwardRef((p, ref) => {
  const props = mergeProps(defaultProps, p);
  const rootRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  function getWidth(ref) {
    const element = ref.current;
    if (!element) return 0;
    return element.offsetWidth;
  }

  function getLeftWidth() {
    return getWidth(leftRef);
  }

  function getRightWidth() {
    return getWidth(rightRef);
  }

  const [{
    x
  }, api] = useSpring(() => ({
    x: 0,
    config: {
      tension: 200,
      friction: 30
    }
  }), []);
  const draggingRef = useRef(false);
  const bind = useDrag(state => {
    draggingRef.current = true;
    const [offsetX] = state.offset;

    if (state.last) {
      const leftWidth = getLeftWidth();
      const rightWidth = getRightWidth();
      let position = offsetX + state.velocity[0] * state.direction[0] * 50;

      if (offsetX > 0) {
        position = Math.max(0, position);
      } else if (offsetX < 0) {
        position = Math.min(0, position);
      } else {
        position = 0;
      }

      api.start({
        x: nearest([-rightWidth, 0, leftWidth], position)
      });
      window.setTimeout(() => {
        draggingRef.current = false;
      });
    } else {
      api.start({
        x: offsetX,
        immediate: true
      });
    }
  }, {
    from: () => [x.get(), 0],
    bounds: () => {
      const leftWidth = getLeftWidth();
      const rightWidth = getRightWidth();
      return {
        left: -rightWidth,
        right: leftWidth
      };
    },
    // rubberband: true,
    axis: 'x',
    preventScroll: true,
    pointer: {
      touch: true
    }
  });

  function close() {
    api.start({
      x: 0
    });
  }

  useImperativeHandle(ref, () => ({
    show: (side = 'right') => {
      if (side === 'right') {
        api.start({
          x: -getRightWidth()
        });
      } else if (side === 'left') {
        api.start({
          x: getLeftWidth()
        });
      }
    },
    close
  }));
  useEffect(() => {
    if (!props.closeOnTouchOutside) return;

    function handle(e) {
      if (x.get() === 0) {
        return;
      }

      const root = rootRef.current;

      if (root && !root.contains(e.target)) {
        close();
      }
    }

    document.addEventListener('touchstart', handle);
    return () => {
      document.removeEventListener('touchstart', handle);
    };
  }, [props.closeOnTouchOutside]);

  function renderAction(action) {
    var _a, _b;

    const color = (_a = action.color) !== null && _a !== void 0 ? _a : 'light';
    return React.createElement(Button, {
      key: action.key,
      className: 'adm-swipe-action-action-button',
      style: {
        '--background-color': (_b = colorRecord[color]) !== null && _b !== void 0 ? _b : color
      },
      onClick: e => {
        var _a, _b;

        if (props.closeOnAction) {
          close();
        }

        (_a = action.onClick) === null || _a === void 0 ? void 0 : _a.call(action, e);
        (_b = props.onAction) === null || _b === void 0 ? void 0 : _b.call(props, action, e);
      }
    }, action.text);
  }

  return withNativeProps(props, React.createElement("div", Object.assign({
    className: 'adm-swipe-action'
  }, bind(), {
    ref: rootRef,
    onClickCapture: e => {
      if (draggingRef.current) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
  }), React.createElement(animated.div, {
    className: 'adm-swipe-action-track',
    style: {
      x
    }
  }, React.createElement("div", {
    className: 'adm-swipe-action-actions adm-swipe-action-actions-left',
    ref: leftRef
  }, props.leftActions.map(renderAction)), React.createElement("div", {
    className: 'adm-swipe-action-content',
    onClickCapture: e => {
      if (x.goal !== 0) {
        e.preventDefault();
        e.stopPropagation();
        api.start({
          x: 0
        });
      }
    }
  }, React.createElement(animated.div, {
    style: {
      pointerEvents: x.to(v => v !== 0 && x.goal !== 0 ? 'none' : 'unset')
    }
  }, props.children)), React.createElement("div", {
    className: 'adm-swipe-action-actions adm-swipe-action-actions-right',
    ref: rightRef
  }, props.rightActions.map(renderAction)))));
});
const colorRecord = {
  light: 'var(--adm-color-light)',
  weak: 'var(--adm-color-weak)',
  primary: 'var(--adm-color-primary)',
  success: 'var(--adm-color-success)',
  warning: 'var(--adm-color-warning)',
  danger: 'var(--adm-color-danger)'
};