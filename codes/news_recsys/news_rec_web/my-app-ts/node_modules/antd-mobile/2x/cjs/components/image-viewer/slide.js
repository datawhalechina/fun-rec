"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Slide = void 0;

var _react = _interopRequireWildcard(require("react"));

var _web = require("@react-spring/web");

var _rubberband = require("../../utils/rubberband");

var _useDragAndPinch = require("../../utils/use-drag-and-pinch");

var _bound = require("../../utils/bound");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const classPrefix = `adm-image-viewer`;

const Slide = props => {
  const {
    dragLockRef
  } = props;
  const controlRef = (0, _react.useRef)(null);
  const imgRef = (0, _react.useRef)(null);
  const [{
    zoom,
    x,
    y
  }, api] = (0, _web.useSpring)(() => ({
    zoom: 1,
    x: 0,
    y: 0,
    config: {
      tension: 200
    }
  }));
  const pinchLockRef = (0, _react.useRef)(false);

  function boundXY([x, y], rubberband) {
    const currentZoom = zoom.get();
    let xOffset = 0,
        yOffset = 0;

    if (imgRef.current && controlRef.current) {
      xOffset = ((currentZoom * imgRef.current.width || 0) - controlRef.current.clientWidth) / 2;
      yOffset = ((currentZoom * imgRef.current.height || 0) - controlRef.current.clientHeight) / 2;
    }

    xOffset = xOffset > 0 ? xOffset : 0;
    yOffset = yOffset > 0 ? yOffset : 0;
    const bounds = {
      left: -xOffset,
      right: xOffset,
      top: -yOffset,
      bottom: yOffset
    };

    if (rubberband) {
      return [(0, _rubberband.rubberbandIfOutOfBounds)(x, bounds.left, bounds.right, currentZoom * 50), (0, _rubberband.rubberbandIfOutOfBounds)(y, bounds.top, bounds.bottom, currentZoom * 50)];
    } else {
      return [(0, _bound.bound)(x, bounds.left, bounds.right), (0, _bound.bound)(y, bounds.top, bounds.bottom)];
    }
  }

  (0, _useDragAndPinch.useDragAndPinch)({
    onDrag: state => {
      if (state.tap && state.elapsedTime > 0 && state.elapsedTime < 1000) {
        // 判断点击时间>0是为了过滤掉非正常操作，例如用户长按选择图片之后的取消操作（也是一次点击）
        props.onTap();
        return;
      }

      const currentZoom = zoom.get();

      if (dragLockRef) {
        dragLockRef.current = currentZoom !== 1;
      }

      if (!pinchLockRef.current && currentZoom <= 1) {
        api.start({
          x: 0,
          y: 0
        });
      } else {
        if (state.last) {
          const [x, y] = boundXY([state.offset[0] + state.velocity[0] * state.direction[0] * 200, state.offset[1] + state.velocity[1] * state.direction[1] * 200], false);
          api.start({
            x,
            y
          });
        } else {
          const [x, y] = boundXY(state.offset, true);
          api.start({
            x,
            y,
            immediate: true
          });
        }
      }
    },
    onPinch: state => {
      var _a;

      pinchLockRef.current = !state.last;
      const [d] = state.offset;
      if (d < 0) return;
      const nextZoom = state.last ? (0, _bound.bound)(d, 1, props.maxZoom) : d;
      api.start({
        zoom: nextZoom,
        immediate: !state.last
      });
      (_a = props.onZoomChange) === null || _a === void 0 ? void 0 : _a.call(props, nextZoom);

      if (state.last && nextZoom <= 1) {
        api.start({
          x: 0,
          y: 0
        });

        if (dragLockRef) {
          dragLockRef.current = false;
        }
      } else {
        if (dragLockRef) {
          dragLockRef.current = true;
        }
      }
    }
  }, {
    target: controlRef,
    drag: {
      // filterTaps: true,
      from: () => [x.get(), y.get()],
      pointer: {
        touch: true
      }
    },
    pinch: {
      from: () => [zoom.get(), 0],
      pointer: {
        touch: true
      }
    }
  });
  return _react.default.createElement("div", {
    className: `${classPrefix}-slide`,
    onPointerMove: e => {
      if (zoom.get() !== 1) {
        e.stopPropagation();
      }
    }
  }, _react.default.createElement("div", {
    className: `${classPrefix}-control`,
    ref: controlRef
  }, _react.default.createElement(_web.animated.div, {
    className: `${classPrefix}-image-wrapper`,
    style: {
      translateX: x,
      translateY: y,
      scale: zoom
    }
  }, _react.default.createElement("img", {
    ref: imgRef,
    src: props.image,
    draggable: false,
    alt: props.image
  }))));
};

exports.Slide = Slide;