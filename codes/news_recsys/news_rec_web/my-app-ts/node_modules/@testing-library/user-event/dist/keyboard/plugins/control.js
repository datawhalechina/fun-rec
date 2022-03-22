"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keydownBehavior = void 0;

var _utils = require("../../utils");

var _shared = require("../shared");

/**
 * This file should contain behavior for arrow keys as described here:
 * https://w3c.github.io/uievents-code/#key-controlpad-section
 */
const keydownBehavior = [{
  matches: (keyDef, element) => (keyDef.key === 'Home' || keyDef.key === 'End') && ((0, _utils.isElementType)(element, ['input', 'textarea']) || (0, _utils.isContentEditable)(element)),
  handle: (keyDef, element) => {
    // This could probably been improved by collapsing a selection range
    if (keyDef.key === 'Home') {
      (0, _utils.setSelectionRange)(element, 0, 0);
    } else {
      var _getValue$length, _getValue;

      const newPos = (_getValue$length = (_getValue = (0, _utils.getValue)(element)) == null ? void 0 : _getValue.length) != null ? _getValue$length :
      /* istanbul ignore next */
      0;
      (0, _utils.setSelectionRange)(element, newPos, newPos);
    }
  }
}, {
  matches: (keyDef, element) => (keyDef.key === 'PageUp' || keyDef.key === 'PageDown') && (0, _utils.isElementType)(element, ['input']),
  handle: (keyDef, element) => {
    // This could probably been improved by collapsing a selection range
    if (keyDef.key === 'PageUp') {
      (0, _utils.setSelectionRange)(element, 0, 0);
    } else {
      var _getValue$length2, _getValue2;

      const newPos = (_getValue$length2 = (_getValue2 = (0, _utils.getValue)(element)) == null ? void 0 : _getValue2.length) != null ? _getValue$length2 :
      /* istanbul ignore next */
      0;
      (0, _utils.setSelectionRange)(element, newPos, newPos);
    }
  }
}, {
  matches: (keyDef, element) => keyDef.key === 'Delete' && (0, _utils.isEditable)(element) && !(0, _utils.isCursorAtEnd)(element),
  handle: (keDef, element, options, state) => {
    const {
      newValue,
      newSelectionStart
    } = (0, _utils.calculateNewValue)('', element, state.carryValue, undefined, 'forward');
    (0, _shared.fireInputEvent)(element, {
      newValue,
      newSelectionStart,
      eventOverrides: {
        inputType: 'deleteContentForward'
      }
    });
    (0, _shared.carryValue)(element, state, newValue);
  }
}];
exports.keydownBehavior = keydownBehavior;