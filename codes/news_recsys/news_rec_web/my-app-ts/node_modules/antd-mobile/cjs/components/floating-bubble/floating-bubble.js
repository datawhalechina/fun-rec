"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FloatingBubble = void 0;

var _react = _interopRequireWildcard(require("react"));

var _web = require("@react-spring/web");

var _react2 = require("@use-gesture/react");

var _withDefaultProps = require("../../utils/with-default-props");

var _nativeProps = require("../../utils/native-props");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const classPrefix = `adm-floating-bubble`;
const defaultProps = {
  axis: 'y'
};

const FloatingBubble = p => {
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, p);
  const boundaryRef = (0, _react.useRef)(null);
  const buttonRef = (0, _react.useRef)(null);
  /**
   * memoize the `to` function
   * inside a component that renders frequently
   * to prevent an unintended restart
   */

  const [{
    x,
    y,
    opacity
  }, api] = (0, _web.useSpring)(() => ({
    x: 0,
    y: 0,
    opacity: 1
  }));
  const bind = (0, _react2.useDrag)(state => {
    let nextX = state.offset[0];
    let nextY = state.offset[1];

    if (state.last && props.magnetic) {
      const boundary = boundaryRef.current;
      const button = buttonRef.current;
      if (!boundary || !button) return;
      const boundaryRect = boundary.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();

      if (props.magnetic === 'x') {
        const compensation = x.goal - x.get();
        const leftDistance = buttonRect.left + compensation - boundaryRect.left;
        const rightDistance = boundaryRect.right - (buttonRect.right + compensation);

        if (rightDistance <= leftDistance) {
          nextX += rightDistance;
        } else {
          nextX -= leftDistance;
        }
      } else if (props.magnetic === 'y') {
        const compensation = y.goal - y.get();
        const topDistance = buttonRect.top + compensation - boundaryRect.top;
        const bottomDistance = boundaryRect.bottom - (buttonRect.bottom + compensation);

        if (bottomDistance <= topDistance) {
          nextY += bottomDistance;
        } else {
          nextY -= topDistance;
        }
      }
    }

    api.start({
      x: nextX,
      y: nextY
    }); // active status

    api.start({
      opacity: state.active ? 0.8 : 1
    });
  }, {
    axis: props.axis === 'xy' ? undefined : props.axis,
    pointer: {
      touch: true
    },
    // the component won't trigger drag logic if the user just clicked on the component.
    filterTaps: true,
    // set constraints to the user gesture
    bounds: boundaryRef,
    from: () => [x.get(), y.get()]
  });
  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    className: classPrefix
  }, _react.default.createElement("div", {
    className: `${classPrefix}-boundary-outer`
  }, _react.default.createElement("div", {
    className: `${classPrefix}-boundary`,
    ref: boundaryRef
  })), _react.default.createElement(_web.animated.div, Object.assign({}, bind(), {
    style: {
      opacity,
      transform: (0, _web.to)([x, y], (x, y) => `translate(${x}px, ${y}px)`)
    },
    onClick: props.onClick,
    className: `${classPrefix}-button`,
    ref: buttonRef
  }), props.children)));
};

exports.FloatingBubble = FloatingBubble;