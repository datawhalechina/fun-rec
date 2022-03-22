import canUseDom from '../../../utils/canUseDom';
export default function isDocumentVisible() {
  if (canUseDom()) {
    return document.visibilityState !== 'hidden';
  }

  return true;
}