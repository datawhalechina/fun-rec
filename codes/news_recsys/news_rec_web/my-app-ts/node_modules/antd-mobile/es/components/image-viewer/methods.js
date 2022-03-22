import React from 'react';
import { ImageViewer, MultiImageViewer } from './image-viewer';
import { renderImperatively } from '../../utils/render-imperatively';
const handlerSet = new Set();
export function showImageViewer(props) {
  clearImageViewer();
  const handler = renderImperatively(React.createElement(ImageViewer, Object.assign({}, props, {
    afterClose: () => {
      var _a;

      handlerSet.delete(handler);
      (_a = props.afterClose) === null || _a === void 0 ? void 0 : _a.call(props);
    }
  })));
  handlerSet.add(handler);
  return handler;
}
export function showMultiImageViewer(props) {
  clearImageViewer();
  const handler = renderImperatively(React.createElement(MultiImageViewer, Object.assign({}, props, {
    afterClose: () => {
      var _a;

      handlerSet.delete(handler);
      (_a = props.afterClose) === null || _a === void 0 ? void 0 : _a.call(props);
    }
  })));
  handlerSet.add(handler);
  return handler;
}
export function clearImageViewer() {
  handlerSet.forEach(handler => {
    handler.close();
  });
  handlerSet.clear();
}