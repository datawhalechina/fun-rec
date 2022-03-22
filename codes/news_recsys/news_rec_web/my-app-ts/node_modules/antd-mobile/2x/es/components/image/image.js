import { mergeProps } from '../../utils/with-default-props';
import React, { useState, useRef } from 'react';
import { withNativeProps } from '../../utils/native-props';
import { PictureOutline, PictureWrongOutline } from 'antd-mobile-icons';
import { staged } from 'staged-components';
import { toCSSLength } from '../../utils/to-css-length';
import { LazyDetector } from './lazy-detector';
import { useIsomorphicUpdateLayoutEffect } from '../../utils/use-isomorphic-update-layout-effect';
const classPrefix = `adm-image`;
const defaultProps = {
  fit: 'fill',
  placeholder: React.createElement("div", {
    className: `${classPrefix}-tip`
  }, React.createElement(PictureOutline, null)),
  fallback: React.createElement("div", {
    className: `${classPrefix}-tip`
  }, React.createElement(PictureWrongOutline, null)),
  lazy: false
};
export const Image = staged(p => {
  const props = mergeProps(defaultProps, p);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const ref = useRef(null);
  let src = props.src;
  let srcSet = props.srcSet;
  const [initialized, setInitialized] = useState(!props.lazy);
  src = initialized ? props.src : undefined;
  srcSet = initialized ? props.srcSet : undefined;
  useIsomorphicUpdateLayoutEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  function renderInner() {
    if (failed) {
      return React.createElement(React.Fragment, null, props.fallback);
    }

    const img = React.createElement("img", {
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
    return React.createElement(React.Fragment, null, !loaded && props.placeholder, img);
  }

  const style = {};

  if (props.width) {
    style['--width'] = toCSSLength(props.width);
  }

  if (props.height) {
    style['--height'] = toCSSLength(props.height);
  }

  return withNativeProps(props, React.createElement("div", {
    ref: ref,
    className: classPrefix,
    style: style
  }, props.lazy && !initialized && React.createElement(LazyDetector, {
    onActive: () => {
      setInitialized(true);
    }
  }), renderInner()));
});