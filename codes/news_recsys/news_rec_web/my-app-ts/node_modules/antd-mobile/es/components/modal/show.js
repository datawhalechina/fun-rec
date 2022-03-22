import React from 'react';
import { Modal } from './modal';
import { renderImperatively } from '../../utils/render-imperatively';
export const closeFnSet = new Set();
export function show(props) {
  const handler = renderImperatively(React.createElement(Modal, Object.assign({}, props, {
    afterClose: () => {
      var _a;

      closeFnSet.delete(handler.close);
      (_a = props.afterClose) === null || _a === void 0 ? void 0 : _a.call(props);
    }
  })));
  closeFnSet.add(handler.close);
  return handler;
}