"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SwipeAction = void 0;

var _react = _interopRequireWildcard(require("react"));

var _withDefaultProps = require("../../utils/with-default-props");

var _web = require("@react-spring/web");

var _react2 = require("@use-gesture/react");

var _button = _interopRequireDefault(require("../button"));

var _nearest = require("../../utils/nearest");

var _nativeProps = require("../../utils/native-props");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const defaultProps = {
  rightActions: [],
  leftActions: [],
  closeOnTouchOutside: true,
  closeOnAction: true
};
const SwipeAction = (0, _react.forwardRef)((p, ref) => {
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, p);
  const rootRef = (0, _react.useRef)(null);
  const leftRef = (0, _react.useRef)(null);
  const rightRef = (0, _react.useRef)(null);

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
  }, api] = (0, _web.useSpring)(() => ({
    x: 0,
    config: {
      tension: 200,
      friction: 30
    }
  }), []);
  const draggingRef = (0, _react.useRef)(false);
  const bind = (0, _react2.useDrag)(state => {
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
        x: (0, _nearest.nearest)([-rightWidth, 0, leftWidth], position)
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

  (0, _react.useImperativeHandle)(ref, () => ({
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
  (0, _react.useEffect)(() => {
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
    return _react.default.createElement(_button.default, {
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

  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", Object.assign({
    className: 'adm-swipe-action'
  }, bind(), {
    ref: rootRef,
    onClickCapture: e => {
      if (draggingRef.current) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
  }), _react.default.createElement(_web.animated.div, {
    className: 'adm-swipe-action-track',
    style: {
      x
    }
  }, _react.default.createElement("div", {
    className: 'adm-swipe-action-actions adm-swipe-action-actions-left',
    ref: leftRef
  }, props.leftActions.map(renderAction)), _react.default.createElement("div", {
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
  }, _react.default.createElement(_web.animated.div, {
    style: {
      pointerEvents: x.to(v => v !== 0 && x.goal !== 0 ? 'none' : 'unset')
    }
  }, props.children)), _react.default.createElement("div", {
    className: 'adm-swipe-action-actions adm-swipe-action-actions-right',
    ref: rightRef
  }, props.rightActions.map(renderAction)))));
});
exports.SwipeAction = SwipeAction;
const colorRecord = {
  light: 'var(--adm-color-light)',
  weak: 'var(--adm-color-weak)',
  primary: 'var(--adm-color-primary)',
  success: 'var(--adm-color-success)',
  warning: 'var(--adm-color-warning)',
  danger: 'var(--adm-color-danger)'
};