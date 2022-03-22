import { canUseDom } from './can-use-dom';
export let supportsPassive = false;

if (canUseDom) {
  try {
    const opts = {};
    Object.defineProperty(opts, 'passive', {
      get() {
        supportsPassive = true;
      }

    });
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}