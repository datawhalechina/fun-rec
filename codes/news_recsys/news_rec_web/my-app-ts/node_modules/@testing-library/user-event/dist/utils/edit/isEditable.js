"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.editableInputTypes = void 0;
exports.isEditable = isEditable;
exports.isEditableInput = isEditableInput;

var _isElementType = require("../misc/isElementType");

var _isContentEditable = require("./isContentEditable");

function isEditable(element) {
  return isEditableInput(element) || (0, _isElementType.isElementType)(element, 'textarea', {
    readOnly: false
  }) || (0, _isContentEditable.isContentEditable)(element);
}

let editableInputTypes;
exports.editableInputTypes = editableInputTypes;

(function (editableInputTypes) {
  editableInputTypes["text"] = "text";
  editableInputTypes["date"] = "date";
  editableInputTypes["datetime-local"] = "datetime-local";
  editableInputTypes["email"] = "email";
  editableInputTypes["month"] = "month";
  editableInputTypes["number"] = "number";
  editableInputTypes["password"] = "password";
  editableInputTypes["search"] = "search";
  editableInputTypes["tel"] = "tel";
  editableInputTypes["time"] = "time";
  editableInputTypes["url"] = "url";
  editableInputTypes["week"] = "week";
})(editableInputTypes || (exports.editableInputTypes = editableInputTypes = {}));

function isEditableInput(element) {
  return (0, _isElementType.isElementType)(element, 'input', {
    readOnly: false
  }) && Boolean(editableInputTypes[element.type]);
}