"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var canUseDom_1 = __importDefault(require("../../../utils/canUseDom"));

var isDocumentVisible_1 = __importDefault(require("./isDocumentVisible"));

var listeners = [];

function subscribe(listener) {
  listeners.push(listener);
  return function unsubscribe() {
    var index = listeners.indexOf(listener);
    listeners.splice(index, 1);
  };
}

if (canUseDom_1["default"]()) {
  var revalidate = function revalidate() {
    if (!isDocumentVisible_1["default"]()) return;

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }
  };

  window.addEventListener('visibilitychange', revalidate, false);
}

exports["default"] = subscribe;