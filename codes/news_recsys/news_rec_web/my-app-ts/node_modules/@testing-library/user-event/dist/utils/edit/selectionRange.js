"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSelectionRange = getSelectionRange;
exports.hasSelectionSupport = hasSelectionSupport;
exports.setSelectionRange = setSelectionRange;

var _isElementType = require("../misc/isElementType");

// https://github.com/jsdom/jsdom/blob/c2fb8ff94917a4d45e2398543f5dd2a8fed0bdab/lib/jsdom/living/nodes/HTMLInputElement-impl.js#L45
var selectionSupportType;

(function (selectionSupportType) {
  selectionSupportType["text"] = "text";
  selectionSupportType["search"] = "search";
  selectionSupportType["url"] = "url";
  selectionSupportType["tel"] = "tel";
  selectionSupportType["password"] = "password";
})(selectionSupportType || (selectionSupportType = {}));

const InputSelection = Symbol('inputSelection');

function hasSelectionSupport(element) {
  return (0, _isElementType.isElementType)(element, 'textarea') || (0, _isElementType.isElementType)(element, 'input') && Boolean(selectionSupportType[element.type]);
}

function getSelectionRange(element) {
  if (hasSelectionSupport(element)) {
    return {
      selectionStart: element.selectionStart,
      selectionEnd: element.selectionEnd
    };
  }

  if ((0, _isElementType.isElementType)(element, 'input')) {
    var _InputSelection;

    return (_InputSelection = element[InputSelection]) != null ? _InputSelection : {
      selectionStart: null,
      selectionEnd: null
    };
  }

  const selection = element.ownerDocument.getSelection(); // there should be no editing if the focusNode is outside of element
  // TODO: properly handle selection ranges

  if (selection != null && selection.rangeCount && element.contains(selection.focusNode)) {
    const range = selection.getRangeAt(0);
    return {
      selectionStart: range.startOffset,
      selectionEnd: range.endOffset
    };
  } else {
    return {
      selectionStart: null,
      selectionEnd: null
    };
  }
}

function setSelectionRange(element, newSelectionStart, newSelectionEnd) {
  const {
    selectionStart,
    selectionEnd
  } = getSelectionRange(element);

  if (selectionStart === newSelectionStart && selectionEnd === newSelectionEnd) {
    return;
  }

  if (hasSelectionSupport(element)) {
    element.setSelectionRange(newSelectionStart, newSelectionEnd);
  }

  if ((0, _isElementType.isElementType)(element, 'input')) {
    ;
    element[InputSelection] = {
      selectionStart: newSelectionStart,
      selectionEnd: newSelectionEnd
    };
  } // Moving the selection inside <input> or <textarea> does not alter the document Selection.


  if ((0, _isElementType.isElementType)(element, 'input') || (0, _isElementType.isElementType)(element, 'textarea')) {
    return;
  }

  const range = element.ownerDocument.createRange();
  range.selectNodeContents(element); // istanbul ignore else

  if (element.firstChild) {
    range.setStart(element.firstChild, newSelectionStart);
    range.setEnd(element.firstChild, newSelectionEnd);
  }

  const selection = element.ownerDocument.getSelection(); // istanbul ignore else

  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }
}