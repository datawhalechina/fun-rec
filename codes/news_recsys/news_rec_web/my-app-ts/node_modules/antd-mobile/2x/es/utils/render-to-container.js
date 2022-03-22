import { createPortal } from 'react-dom';
import { resolveContainer } from './get-container';
import { canUseDom } from './can-use-dom';
export function renderToContainer(getContainer, node) {
  if (canUseDom && getContainer) {
    const container = resolveContainer(getContainer);
    return createPortal(node, container);
  }

  return node;
}