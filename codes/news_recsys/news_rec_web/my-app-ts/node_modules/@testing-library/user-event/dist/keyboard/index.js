"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keyboard = keyboard;
exports.keyboardImplementationWrapper = keyboardImplementationWrapper;
Object.defineProperty(exports, "specialCharMap", {
  enumerable: true,
  get: function () {
    return _specialCharMap.specialCharMap;
  }
});

var _dom = require("@testing-library/dom");

var _keyboardImplementation = require("./keyboardImplementation");

var _keyMap = require("./keyMap");

var _specialCharMap = require("./specialCharMap");

function keyboard(text, options) {
  var _options$delay;

  const {
    promise,
    state
  } = keyboardImplementationWrapper(text, options);

  if (((_options$delay = options == null ? void 0 : options.delay) != null ? _options$delay : 0) > 0) {
    return (0, _dom.getConfig)().asyncWrapper(() => promise.then(() => state));
  } else {
    // prevent users from dealing with UnhandledPromiseRejectionWarning in sync call
    promise.catch(console.error);
    return state;
  }
}

function keyboardImplementationWrapper(text, config = {}) {
  const {
    keyboardState: state = createKeyboardState(),
    delay = 0,
    document: doc = document,
    autoModify = false,
    keyboardMap = _keyMap.defaultKeyMap
  } = config;
  const options = {
    delay,
    document: doc,
    autoModify,
    keyboardMap
  };
  return {
    promise: (0, _keyboardImplementation.keyboardImplementation)(text, options, state),
    state,
    releaseAllKeys: () => (0, _keyboardImplementation.releaseAllKeys)(options, state)
  };
}

function createKeyboardState() {
  return {
    activeElement: null,
    pressed: [],
    carryChar: '',
    modifiers: {
      alt: false,
      caps: false,
      ctrl: false,
      meta: false,
      shift: false
    }
  };
}