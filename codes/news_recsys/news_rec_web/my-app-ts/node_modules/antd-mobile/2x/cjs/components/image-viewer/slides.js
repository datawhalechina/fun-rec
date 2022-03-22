"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Slides = void 0;

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@use-gesture/react");

var _web = require("@react-spring/web");

var _slide = require("./slide");

var _convertPx = require("../../utils/convert-px");

var _bound = require("../../utils/bound");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const classPrefix = `adm-image-viewer`;
const Slides = (0, _react.forwardRef)((props, ref) => {
  const slideWidth = window.innerWidth + (0, _convertPx.convertPx)(16);
  const [{
    x
  }, api] = (0, _web.useSpring)(() => ({
    x: props.defaultIndex * slideWidth,
    config: {
      tension: 250,
      clamp: true
    }
  }));
  const count = props.images.length;

  function swipeTo(index, immediate = false) {
    var _a;

    const i = (0, _bound.bound)(index, 0, count - 1);
    (_a = props.onIndexChange) === null || _a === void 0 ? void 0 : _a.call(props, i);
    api.start({
      x: i * slideWidth,
      immediate
    });
  }

  (0, _react.useImperativeHandle)(ref, () => ({
    swipeTo
  }));
  const dragLockRef = (0, _react.useRef)(false);
  const bind = (0, _react2.useDrag)(state => {
    if (dragLockRef.current) return;
    const [offsetX] = state.offset;

    if (state.last) {
      const minIndex = Math.floor(offsetX / slideWidth);
      const maxIndex = minIndex + 1;
      const velocityOffset = Math.min(state.velocity[0] * 2000, slideWidth) * state.direction[0];
      swipeTo((0, _bound.bound)(Math.round((offsetX + velocityOffset) / slideWidth), minIndex, maxIndex));
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
  return _react.default.createElement("div", Object.assign({
    className: `${classPrefix}-slides`
  }, bind()), _react.default.createElement(_web.animated.div, {
    className: `${classPrefix}-indicator`
  }, x.to(v => {
    const index = (0, _bound.bound)(Math.round(v / slideWidth), 0, count - 1);
    return `${index + 1} / ${count}`;
  })), _react.default.createElement(_web.animated.div, {
    className: `${classPrefix}-slides-inner`,
    style: {
      x: x.to(x => -x)
    }
  }, props.images.map(image => _react.default.createElement(_slide.Slide, {
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
exports.Slides = Slides;