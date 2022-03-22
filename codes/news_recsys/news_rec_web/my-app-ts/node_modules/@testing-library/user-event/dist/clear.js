"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clear = clear;

var _utils = require("./utils");

var _type = require("./type");

function clear(element) {
  var _element$selectionSta, _element$selectionEnd;

  if (!(0, _utils.isElementType)(element, ['input', 'textarea'])) {
    // TODO: support contenteditable
    throw new Error('clear currently only supports input and textarea elements.');
  }

  if ((0, _utils.isDisabled)(element)) {
    return;
  } // TODO: track the selection range ourselves so we don't have to do this input "type" trickery
  // just like cypress does: https://github.com/cypress-io/cypress/blob/8d7f1a0bedc3c45a2ebf1ff50324b34129fdc683/packages/driver/src/dom/selection.ts#L16-L37


  const elementType = element.type;

  if (elementType !== 'textarea') {
    // setSelectionRange is not supported on certain types of inputs, e.g. "number" or "email"
    ;
    element.type = 'text';
  }

  (0, _type.type)(element, '{selectall}{del}', {
    delay: 0,
    initialSelectionStart: (_element$selectionSta = element.selectionStart) != null ? _element$selectionSta :
    /* istanbul ignore next */
    undefined,
    initialSelectionEnd: (_element$selectionEnd = element.selectionEnd) != null ? _element$selectionEnd :
    /* istanbul ignore next */
    undefined
  });

  if (elementType !== 'textarea') {
    ;
    element.type = elementType;
  }
}