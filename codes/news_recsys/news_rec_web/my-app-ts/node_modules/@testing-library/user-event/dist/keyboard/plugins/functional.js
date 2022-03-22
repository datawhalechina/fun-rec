"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preKeyupBehavior = exports.preKeydownBehavior = exports.postKeyupBehavior = exports.keyupBehavior = exports.keypressBehavior = exports.keydownBehavior = void 0;

var _dom = require("@testing-library/dom");

var _utils = require("../../utils");

var _getEventProps = require("../getEventProps");

var _shared = require("../shared");

/**
 * This file should contain behavior for functional keys as described here:
 * https://w3c.github.io/uievents-code/#key-alphanumeric-functional
 */
const modifierKeys = {
  Alt: 'alt',
  Control: 'ctrl',
  Shift: 'shift',
  Meta: 'meta'
};
const preKeydownBehavior = [// modifierKeys switch on the modifier BEFORE the keydown event
...Object.entries(modifierKeys).map(([key, modKey]) => ({
  matches: keyDef => keyDef.key === key,
  handle: (keyDef, element, options, state) => {
    state.modifiers[modKey] = true;
  }
})), // AltGraph produces an extra keydown for Control
// The modifier does not change
{
  matches: keyDef => keyDef.key === 'AltGraph',
  handle: (keyDef, element, options, state) => {
    var _options$keyboardMap$;

    const ctrlKeyDef = (_options$keyboardMap$ = options.keyboardMap.find(k => k.key === 'Control')) != null ? _options$keyboardMap$ :
    /* istanbul ignore next */
    {
      key: 'Control',
      code: 'Control'
    };

    _dom.fireEvent.keyDown(element, (0, _getEventProps.getKeyEventProps)(ctrlKeyDef, state));
  }
}];
exports.preKeydownBehavior = preKeydownBehavior;
const keydownBehavior = [{
  matches: keyDef => keyDef.key === 'CapsLock',
  handle: (keyDef, element, options, state) => {
    state.modifiers.caps = !state.modifiers.caps;
  }
}, {
  matches: (keyDef, element) => keyDef.key === 'Backspace' && (0, _utils.isEditable)(element) && !(0, _utils.isCursorAtStart)(element),
  handle: (keyDef, element, options, state) => {
    const {
      newValue,
      newSelectionStart
    } = (0, _utils.calculateNewValue)('', element, state.carryValue, undefined, 'backward');
    (0, _shared.fireInputEvent)(element, {
      newValue,
      newSelectionStart,
      eventOverrides: {
        inputType: 'deleteContentBackward'
      }
    });
    (0, _shared.carryValue)(element, state, newValue);
  }
}];
exports.keydownBehavior = keydownBehavior;
const keypressBehavior = [{
  matches: (keyDef, element) => keyDef.key === 'Enter' && (0, _utils.isElementType)(element, 'input') && ['checkbox', 'radio'].includes(element.type),
  handle: (keyDef, element) => {
    const form = element.form;

    if ((0, _utils.hasFormSubmit)(form)) {
      _dom.fireEvent.submit(form);
    }
  }
}, {
  matches: (keyDef, element) => keyDef.key === 'Enter' && ((0, _utils.isClickableInput)(element) || // Links with href defined should handle Enter the same as a click
  (0, _utils.isElementType)(element, 'a') && Boolean(element.href)),
  handle: (keyDef, element, options, state) => {
    _dom.fireEvent.click(element, (0, _getEventProps.getMouseEventProps)(state));
  }
}, {
  matches: (keyDef, element) => keyDef.key === 'Enter' && (0, _utils.isElementType)(element, 'input'),
  handle: (keyDef, element) => {
    const form = element.form;

    if (form && (form.querySelectorAll('input').length === 1 || (0, _utils.hasFormSubmit)(form))) {
      _dom.fireEvent.submit(form);
    }
  }
}];
exports.keypressBehavior = keypressBehavior;
const preKeyupBehavior = [// modifierKeys switch off the modifier BEFORE the keyup event
...Object.entries(modifierKeys).map(([key, modKey]) => ({
  matches: keyDef => keyDef.key === key,
  handle: (keyDef, element, options, state) => {
    state.modifiers[modKey] = false;
  }
}))];
exports.preKeyupBehavior = preKeyupBehavior;
const keyupBehavior = [{
  matches: (keyDef, element) => keyDef.key === ' ' && (0, _utils.isClickableInput)(element),
  handle: (keyDef, element, options, state) => {
    _dom.fireEvent.click(element, (0, _getEventProps.getMouseEventProps)(state));
  }
}];
exports.keyupBehavior = keyupBehavior;
const postKeyupBehavior = [// AltGraph produces an extra keyup for Control
// The modifier does not change
{
  matches: keyDef => keyDef.key === 'AltGraph',
  handle: (keyDef, element, options, state) => {
    var _options$keyboardMap$2;

    const ctrlKeyDef = (_options$keyboardMap$2 = options.keyboardMap.find(k => k.key === 'Control')) != null ? _options$keyboardMap$2 :
    /* istanbul ignore next */
    {
      key: 'Control',
      code: 'Control'
    };

    _dom.fireEvent.keyUp(element, (0, _getEventProps.getKeyEventProps)(ctrlKeyDef, state));
  }
}];
exports.postKeyupBehavior = postKeyupBehavior;