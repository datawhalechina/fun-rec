"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSpaceUntilMaxLength = getSpaceUntilMaxLength;

var _isElementType = require("../misc/isElementType");

var _getValue = require("./getValue");

var maxLengthSupportedTypes;

(function (maxLengthSupportedTypes) {
  maxLengthSupportedTypes["email"] = "email";
  maxLengthSupportedTypes["password"] = "password";
  maxLengthSupportedTypes["search"] = "search";
  maxLengthSupportedTypes["telephone"] = "telephone";
  maxLengthSupportedTypes["text"] = "text";
  maxLengthSupportedTypes["url"] = "url";
})(maxLengthSupportedTypes || (maxLengthSupportedTypes = {}));

function getSpaceUntilMaxLength(element) {
  const value = (0, _getValue.getValue)(element);
  /* istanbul ignore if */

  if (value === null) {
    return undefined;
  }

  const maxLength = getSanitizedMaxLength(element);
  return maxLength ? maxLength - value.length : undefined;
} // can't use .maxLength property because of a jsdom bug:
// https://github.com/jsdom/jsdom/issues/2927


function getSanitizedMaxLength(element) {
  var _element$getAttribute;

  if (!supportsMaxLength(element)) {
    return undefined;
  }

  const attr = (_element$getAttribute = element.getAttribute('maxlength')) != null ? _element$getAttribute : '';
  return /^\d+$/.test(attr) && Number(attr) >= 0 ? Number(attr) : undefined;
}

function supportsMaxLength(element) {
  return (0, _isElementType.isElementType)(element, 'textarea') || (0, _isElementType.isElementType)(element, 'input') && Boolean(maxLengthSupportedTypes[element.type]);
}