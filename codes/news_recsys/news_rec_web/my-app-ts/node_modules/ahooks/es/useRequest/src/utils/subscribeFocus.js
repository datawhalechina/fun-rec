// from swr
import canUseDom from '../../../utils/canUseDom';
import isDocumentVisible from './isDocumentVisible';
import isOnline from './isOnline';
var listeners = [];

function subscribe(listener) {
  listeners.push(listener);
  return function unsubscribe() {
    var index = listeners.indexOf(listener);
    listeners.splice(index, 1);
  };
}

if (canUseDom()) {
  var revalidate = function revalidate() {
    if (!isDocumentVisible() || !isOnline()) return;

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }
  };

  window.addEventListener('visibilitychange', revalidate, false);
  window.addEventListener('focus', revalidate, false);
}

export default subscribe;