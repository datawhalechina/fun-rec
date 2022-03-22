"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasUnreliableEmptyValue = hasUnreliableEmptyValue;

var _isElementType = require("../misc/isElementType");

var unreliableValueInputTypes;
/**
 * Check if an empty IDL value on the element could mean a derivation of displayed value and IDL value
 */

(function (unreliableValueInputTypes) {
  unreliableValueInputTypes["number"] = "number";
})(unreliableValueInputTypes || (unreliableValueInputTypes = {}));

function hasUnreliableEmptyValue(element) {
  return (0, _isElementType.isElementType)(element, 'input') && Boolean(unreliableValueInputTypes[element.type]);
}