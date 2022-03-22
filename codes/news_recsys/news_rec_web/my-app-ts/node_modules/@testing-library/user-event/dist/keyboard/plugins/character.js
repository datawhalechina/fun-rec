"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keypressBehavior = void 0;

var _dom = require("@testing-library/dom");

var _shared = require("../shared");

var _utils = require("../../utils");

/**
 * This file should cover the behavior for keys that produce character input
 */
const keypressBehavior = [{
  matches: (keyDef, element) => {
    var _keyDef$key;

    return ((_keyDef$key = keyDef.key) == null ? void 0 : _keyDef$key.length) === 1 && (0, _utils.isElementType)(element, 'input', {
      type: 'time',
      readOnly: false
    });
  },
  handle: (keyDef, element, options, state) => {
    var _state$carryValue;

    let newEntry = keyDef.key;
    const textToBeTyped = ((_state$carryValue = state.carryValue) != null ? _state$carryValue : '') + newEntry;
    const timeNewEntry = (0, _utils.buildTimeValue)(textToBeTyped);

    if ((0, _utils.isValidInputTimeValue)(element, timeNewEntry)) {
      newEntry = timeNewEntry;
    }

    const {
      newValue,
      newSelectionStart
    } = (0, _utils.calculateNewValue)(newEntry, element);
    const prevValue = (0, _utils.getValue)(element); // this check was provided by fireInputEventIfNeeded
    // TODO: verify if it is even needed by this handler

    if (prevValue !== newValue) {
      (0, _shared.fireInputEvent)(element, {
        newValue,
        newSelectionStart,
        eventOverrides: {
          data: keyDef.key,
          inputType: 'insertText'
        }
      });
    }

    (0, _shared.fireChangeForInputTimeIfValid)(element, prevValue, timeNewEntry);
    state.carryValue = textToBeTyped;
  }
}, {
  matches: (keyDef, element) => {
    var _keyDef$key2;

    return ((_keyDef$key2 = keyDef.key) == null ? void 0 : _keyDef$key2.length) === 1 && (0, _utils.isElementType)(element, 'input', {
      type: 'date',
      readOnly: false
    });
  },
  handle: (keyDef, element, options, state) => {
    var _state$carryValue2;

    let newEntry = keyDef.key;
    const textToBeTyped = ((_state$carryValue2 = state.carryValue) != null ? _state$carryValue2 : '') + newEntry;
    const isValidToBeTyped = (0, _utils.isValidDateValue)(element, textToBeTyped);

    if (isValidToBeTyped) {
      newEntry = textToBeTyped;
    }

    const {
      newValue,
      newSelectionStart
    } = (0, _utils.calculateNewValue)(newEntry, element);
    const prevValue = (0, _utils.getValue)(element); // this check was provided by fireInputEventIfNeeded
    // TODO: verify if it is even needed by this handler

    if (prevValue !== newValue) {
      (0, _shared.fireInputEvent)(element, {
        newValue,
        newSelectionStart,
        eventOverrides: {
          data: keyDef.key,
          inputType: 'insertText'
        }
      });
    }

    if (isValidToBeTyped) {
      _dom.fireEvent.change(element, {
        target: {
          value: textToBeTyped
        }
      });
    }

    state.carryValue = textToBeTyped;
  }
}, {
  matches: (keyDef, element) => {
    var _keyDef$key3;

    return ((_keyDef$key3 = keyDef.key) == null ? void 0 : _keyDef$key3.length) === 1 && (0, _utils.isElementType)(element, 'input', {
      type: 'number',
      readOnly: false
    });
  },
  handle: (keyDef, element, options, state) => {
    var _ref, _state$carryValue3, _newValue$match, _newValue$match2;

    if (!/[\d.\-e]/.test(keyDef.key)) {
      return;
    }

    const oldValue = (_ref = (_state$carryValue3 = state.carryValue) != null ? _state$carryValue3 : (0, _utils.getValue)(element)) != null ? _ref :
    /* istanbul ignore next */
    '';
    const {
      newValue,
      newSelectionStart
    } = (0, _utils.calculateNewValue)(keyDef.key, element, oldValue); // the browser allows some invalid input but not others
    // it allows up to two '-' at any place before any 'e' or one directly following 'e'
    // it allows one '.' at any place before e

    const valueParts = newValue.split('e', 2);

    if (Number((_newValue$match = newValue.match(/-/g)) == null ? void 0 : _newValue$match.length) > 2 || Number((_newValue$match2 = newValue.match(/\./g)) == null ? void 0 : _newValue$match2.length) > 1 || valueParts[1] && !/^-?\d*$/.test(valueParts[1])) {
      return;
    }

    (0, _shared.fireInputEvent)(element, {
      newValue,
      newSelectionStart,
      eventOverrides: {
        data: keyDef.key,
        inputType: 'insertText'
      }
    });
    const appliedValue = (0, _utils.getValue)(element);

    if (appliedValue === newValue) {
      state.carryValue = undefined;
    } else {
      state.carryValue = newValue;
    }
  }
}, {
  matches: (keyDef, element) => {
    var _keyDef$key4;

    return ((_keyDef$key4 = keyDef.key) == null ? void 0 : _keyDef$key4.length) === 1 && ((0, _utils.isElementType)(element, ['input', 'textarea'], {
      readOnly: false
    }) && !(0, _utils.isClickableInput)(element) || (0, _utils.isContentEditable)(element)) && (0, _utils.getSpaceUntilMaxLength)(element) !== 0;
  },
  handle: (keyDef, element) => {
    const {
      newValue,
      newSelectionStart
    } = (0, _utils.calculateNewValue)(keyDef.key, element);
    (0, _shared.fireInputEvent)(element, {
      newValue,
      newSelectionStart,
      eventOverrides: {
        data: keyDef.key,
        inputType: 'insertText'
      }
    });
  }
}, {
  matches: (keyDef, element) => keyDef.key === 'Enter' && ((0, _utils.isElementType)(element, 'textarea', {
    readOnly: false
  }) || (0, _utils.isContentEditable)(element)) && (0, _utils.getSpaceUntilMaxLength)(element) !== 0,
  handle: (keyDef, element, options, state) => {
    const {
      newValue,
      newSelectionStart
    } = (0, _utils.calculateNewValue)('\n', element);
    const inputType = (0, _utils.isContentEditable)(element) && !state.modifiers.shift ? 'insertParagraph' : 'insertLineBreak';
    (0, _shared.fireInputEvent)(element, {
      newValue,
      newSelectionStart,
      eventOverrides: {
        inputType
      }
    });
  }
}];
exports.keypressBehavior = keypressBehavior;