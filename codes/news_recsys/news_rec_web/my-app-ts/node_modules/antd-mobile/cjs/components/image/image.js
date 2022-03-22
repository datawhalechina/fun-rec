"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Image = void 0;

var _withDefaultProps = require("../../utils/with-default-props");

var _react = _interopRequireWildcard(require("react"));

var _nativeProps = require("../../utils/native-props");

var _antdMobileIcons = require("antd-mobile-icons");

var _stagedComponents = require("staged-components");

var _toCssLength = require("../../utils/to-css-length");

var _lazyDetector = require("./lazy-detector");

var _useIsomorphicUpdateLayoutEffect = require("../../utils/use-isomorphic-update-layout-effect");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const classPrefix = `adm-image`;
const defaultProps = {
  fit: 'fill',
  placeholder: _react.default.createElement("div", {
    className: `${classPrefix}-tip`
  }, _react.default.createElement(_antdMobileIcons.PictureOutline, null)),
  fallback: _react.default.createElement("div", {
    className: `${classPrefix}-tip`
  }, _react.default.createElement(_antdMobileIcons.PictureWrongOutline, null)),
  lazy: false
};
const Image = (0, _stagedComponents.staged)(p => {
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, p);
  const [loaded, setLoaded] = (0, _react.useState)(false);
  const [failed, setFailed] = (0, _react.useState)(false);
  const ref = (0, _react.useRef)(null);
  let src = props.src;
  let srcSet = props.srcSet;
  const [initialized, setInitialized] = (0, _react.useState)(!props.lazy);
  src = initialized ? props.src : undefined;
  srcSet = initialized ? props.srcSet : undefined;
  (0, _useIsomorphicUpdateLayoutEffect.useIsomorphicUpdateLayoutEffect)(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  function renderInner() {
    if (failed) {
      return _react.default.createElement(_react.default.Fragment, null, props.fallback);
    }

    const img = _react.default.createElement("img", {
      className: `${classPrefix}-img`,
      src: src,
      alt: props.alt,
      onClick: props.onClick,
      onLoad: e => {
        var _a;

        setLoaded(true);
        (_a = props.onLoad) === null || _a === void 0 ? void 0 : _a.call(props, e);
      },
      onError: e => {
        var _a;

        setFailed(true);
        (_a = props.onError) === null || _a === void 0 ? void 0 : _a.call(props, e);
      },
      style: {
        objectFit: props.fit,
        display: loaded ? 'block' : 'none'
      },
      crossOrigin: props.crossOrigin,
      decoding: props.decoding,
      loading: props.loading,
      referrerPolicy: props.referrerPolicy,
      sizes: props.sizes,
      srcSet: srcSet,
      useMap: props.useMap
    });

    return _react.default.createElement(_react.default.Fragment, null, !loaded && props.placeholder, img);
  }

  const style = {};

  if (props.width) {
    style['--width'] = (0, _toCssLength.toCSSLength)(props.width);
  }

  if (props.height) {
    style['--height'] = (0, _toCssLength.toCSSLength)(props.height);
  }

  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    ref: ref,
    className: classPrefix,
    style: style
  }, props.lazy && !initialized && _react.default.createElement(_lazyDetector.LazyDetector, {
    onActive: () => {
      setInitialized(true);
    }
  }), renderInner()));
});
exports.Image = Image;