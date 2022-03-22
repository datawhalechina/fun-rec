"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keydownBehavior = void 0;

var _utils = require("../../utils");

/**
 * This file should contain behavior for arrow keys as described here:
 * https://w3c.github.io/uievents-code/#key-arrowpad-section
 */
const keydownBehavior = [{
  // TODO: implement for contentEditable
  matches: (keyDef, element) => (keyDef.key === 'ArrowLeft' || keyDef.key === 'ArrowRight') && (0, _utils.isElementType)(element, ['input', 'textarea']),
  handle: (keyDef, element) => {
    var _ref;

    const {
      selectionStart,
      selectionEnd
    } = (0, _utils.getSelectionRange)(element);
    const direction = keyDef.key === 'ArrowLeft' ? -1 : 1;
    const newPos = (_ref = selectionStart === selectionEnd ? (selectionStart != null ? selectionStart :
    /* istanbul ignore next */
    0) + direction : direction < 0 ? selectionStart : selectionEnd) != null ? _ref :
    /* istanbul ignore next */
    0;
    (0, _utils.setSelectionRange)(element, newPos, newPos);
  }
}];
exports.keydownBehavior = keydownBehavior;