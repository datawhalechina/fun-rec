"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subscribe = exports.trigger = void 0;
var listeners = {};

var trigger = function trigger(key, data) {
  if (listeners[key]) {
    listeners[key].forEach(function (item) {
      return item(data);
    });
  }
};

exports.trigger = trigger;

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

exports.subscribe = subscribe;