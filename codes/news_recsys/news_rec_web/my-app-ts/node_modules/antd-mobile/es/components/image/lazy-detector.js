import React, { useEffect, useRef } from 'react';
import { useInViewport } from 'ahooks';
export const LazyDetector = props => {
  const ref = useRef(null);
  const [inViewport] = useInViewport(ref);
  useEffect(() => {
    if (inViewport) {
      props.onActive();
    }
  }, [inViewport]);
  return React.createElement("div", {
    ref: ref
  });
};