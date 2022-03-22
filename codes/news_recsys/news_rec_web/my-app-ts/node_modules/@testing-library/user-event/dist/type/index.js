"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.type = type;

var _dom = require("@testing-library/dom");

var _typeImplementation = require("./typeImplementation");

// this needs to be wrapped in the event/asyncWrapper for React's act and angular's change detection
// depending on whether it will be async.
function type(element, text, {
  delay = 0,
  ...options
} = {}) {
  // we do not want to wrap in the asyncWrapper if we're not
  // going to actually be doing anything async, so we only wrap
  // if the delay is greater than 0
  if (delay > 0) {
    return (0, _dom.getConfig)().asyncWrapper(() => (0, _typeImplementation.typeImplementation)(element, text, {
      delay,
      ...options
    }));
  } else {
    return void (0, _typeImplementation.typeImplementation)(element, text, {
      delay,
      ...options
    }) // prevents users from dealing with UnhandledPromiseRejectionWarning
    .catch(console.error);
  }
}