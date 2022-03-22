"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeImplementation = typeImplementation;

var _utils = require("../utils");

var _click = require("../click");

var _keyboard = require("../keyboard");

async function typeImplementation(element, text, {
  delay,
  skipClick = false,
  skipAutoClose = false,
  initialSelectionStart = undefined,
  initialSelectionEnd = undefined
}) {
  // TODO: properly type guard
  // we use this workaround for now to prevent changing behavior
  if (element.disabled) return;
  if (!skipClick) (0, _click.click)(element); // The focused element could change between each event, so get the currently active element each time

  const currentElement = () => (0, _utils.getActiveElement)(element.ownerDocument); // by default, a new element has its selection start and end at 0
  // but most of the time when people call "type", they expect it to type
  // at the end of the current input value. So, if the selection start
  // and end are both the default of 0, then we'll go ahead and change
  // them to the length of the current value.
  // the only time it would make sense to pass the initialSelectionStart or
  // initialSelectionEnd is if you have an input with a value and want to
  // explicitly start typing with the cursor at 0. Not super common.


  const value = (0, _utils.getValue)(currentElement());
  const {
    selectionStart,
    selectionEnd
  } = (0, _utils.getSelectionRange)(element);

  if (value != null && (selectionStart === null || selectionStart === 0) && (selectionEnd === null || selectionEnd === 0)) {
    (0, _utils.setSelectionRange)(currentElement(), initialSelectionStart != null ? initialSelectionStart : value.length, initialSelectionEnd != null ? initialSelectionEnd : value.length);
  }

  const {
    promise,
    releaseAllKeys
  } = (0, _keyboard.keyboardImplementationWrapper)(text, {
    delay,
    document: element.ownerDocument
  });

  if (delay > 0) {
    await promise;
  }

  if (!skipAutoClose) {
    releaseAllKeys();
  } // eslint-disable-next-line consistent-return -- we need to return the internal Promise so that it is catchable if we don't await


  return promise;
}