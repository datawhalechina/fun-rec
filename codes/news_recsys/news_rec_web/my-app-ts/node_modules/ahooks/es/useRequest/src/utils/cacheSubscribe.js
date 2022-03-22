var listeners = {};

var trigger = function trigger(key, data) {
  if (listeners[key]) {
    listeners[key].forEach(function (item) {
      return item(data);
    });
  }
};

var subscribe = function subscribe(key, listener) {
  if (!listeners[key]) {
    listeners[key] = [];
  }

  listeners[key].push(listener);
  return function unsubscribe() {
    var index = listeners[key].indexOf(listener);
    listeners[key].splice(index, 1);
  };
};

export { trigger, subscribe };