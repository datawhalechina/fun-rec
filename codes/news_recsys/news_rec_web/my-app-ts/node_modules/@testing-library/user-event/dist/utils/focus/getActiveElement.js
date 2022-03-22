"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActiveElement = getActiveElement;

var _isDisabled = require("../misc/isDisabled");

function getActiveElement(document) {
  const activeElement = document.activeElement;

  if (activeElement != null && activeElement.shadowRoot) {
    return getActiveElement(activeElement.shadowRoot);
  } else {
    // Browser does not yield disabled elements as document.activeElement - jsdom does
    if ((0, _isDisabled.isDisabled)(activeElement)) {
      return document.ownerDocument ? // TODO: verify behavior in ShadowRoot

      /* istanbul ignore next */
      document.ownerDocument.body : document.body;
    }

    return activeElement;
  }
}