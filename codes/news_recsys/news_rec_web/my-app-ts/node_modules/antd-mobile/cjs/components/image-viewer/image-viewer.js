"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MultiImageViewer = exports.ImageViewer = void 0;

var _react = _interopRequireWildcard(require("react"));

var _withDefaultProps = require("../../utils/with-default-props");

var _renderToContainer = require("../../utils/render-to-container");

var _mask = _interopRequireDefault(require("../mask"));

var _slide = require("./slide");

var _slides = require("./slides");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const classPrefix = `adm-image-viewer`;
const defaultProps = {
  maxZoom: 3,
  getContainer: null,
  visible: false
};

const ImageViewer = p => {
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, p);

  const node = _react.default.createElement(_mask.default, {
    visible: props.visible,
    disableBodyScroll: false,
    opacity: 'thick',
    afterClose: props.afterClose
  }, _react.default.createElement("div", {
    className: `${classPrefix}-content`
  }, props.image && _react.default.createElement(_slide.Slide, {
    image: props.image,
    onTap: () => {
      var _a;

      (_a = props.onClose) === null || _a === void 0 ? void 0 : _a.call(props);
    },
    maxZoom: props.maxZoom
  })));

  return (0, _renderToContainer.renderToContainer)(props.getContainer, node);
};

exports.ImageViewer = ImageViewer;
const multiDefaultProps = Object.assign(Object.assign({}, defaultProps), {
  defaultIndex: 0
});
const MultiImageViewer = (0, _react.forwardRef)((p, ref) => {
  const props = (0, _withDefaultProps.mergeProps)(multiDefaultProps, p);
  const [defaultIndex, setDefaultIndex] = (0, _react.useState)(props.defaultIndex);
  const slidesRef = (0, _react.useRef)(null);
  (0, _react.useImperativeHandle)(ref, () => ({
    swipeTo: (index, immediate) => {
      var _a;

      setDefaultIndex(index);
      (_a = slidesRef.current) === null || _a === void 0 ? void 0 : _a.swipeTo(index, immediate);
    }
  }));

  const node = _react.default.createElement(_mask.default, {
    visible: props.visible,
    disableBodyScroll: false,
    opacity: 'thick',
    afterClose: props.afterClose
  }, _react.default.createElement("div", {
    className: `${classPrefix}-content`
  }, props.images && _react.default.createElement(_slides.Slides, {
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

  return (0, _renderToContainer.renderToContainer)(props.getContainer, node);
});
exports.MultiImageViewer = MultiImageViewer;