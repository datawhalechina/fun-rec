import React, { createRef, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { resolveContainer } from '../../utils/get-container';
import ReactDOM from 'react-dom';
import { InternalToast } from './toast';
import { mergeProps } from '../../utils/with-default-props';
const containers = [];

function unmount(container) {
  const unmountResult = ReactDOM.unmountComponentAtNode(container);

  if (unmountResult && container.parentNode) {
    container.parentNode.removeChild(container);
  }
}

const defaultProps = {
  duration: 2000,
  position: 'center',
  maskClickable: true
};
export function show(p) {
  const props = mergeProps(defaultProps, typeof p === 'string' ? {
    content: p
  } : p);
  let timer = 0;
  const {
    getContainer = () => document.body
  } = props;
  const container = document.createElement('div');
  const bodyContainer = resolveContainer(getContainer);
  bodyContainer.appendChild(container);
  clear();
  containers.push(container);
  const TempToast = forwardRef((_, ref) => {
    const [visible, setVisible] = useState(true);
    useEffect(() => {
      return () => {
        var _a;

        (_a = props.afterClose) === null || _a === void 0 ? void 0 : _a.call(props);
      };
    }, []);
    useEffect(() => {
      if (props.duration === 0) {
        return;
      }

      timer = window.setTimeout(() => {
        setVisible(false);
      }, props.duration);
      return () => {
        window.clearTimeout(timer);
      };
    }, []);
    useImperativeHandle(ref, () => ({
      close: () => setVisible(false)
    }));
    return React.createElement(InternalToast, Object.assign({}, props, {
      getContainer: () => container,
      visible: visible,
      afterClose: () => {
        unmount(container);
      }
    }));
  });
  const ref = createRef();
  ReactDOM.render(React.createElement(TempToast, {
    ref: ref
  }), container);
  return {
    close: () => {
      var _a;

      (_a = ref.current) === null || _a === void 0 ? void 0 : _a.close();
    }
  };
}
export function clear() {
  while (true) {
    const container = containers.pop();
    if (!container) break;
    unmount(container);
  }
}
export function config(val) {
  if (val.duration !== undefined) {
    defaultProps.duration = val.duration;
  }

  if (val.position !== undefined) {
    defaultProps.position = val.position;
  }

  if (val.maskClickable !== undefined) {
    defaultProps.maskClickable = val.maskClickable;
  }
}