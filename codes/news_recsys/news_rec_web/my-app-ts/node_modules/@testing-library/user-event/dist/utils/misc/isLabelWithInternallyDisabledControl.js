"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isLabelWithInternallyDisabledControl = isLabelWithInternallyDisabledControl;

var _isDisabled = require("./isDisabled");

var _isElementType = require("./isElementType");

// Absolutely NO events fire on label elements that contain their control
// if that control is disabled. NUTS!
// no joke. There are NO events for: <label><input disabled /><label>
function isLabelWithInternallyDisabledControl(element) {
  if (!(0, _isElementType.isElementType)(element, 'label')) {
    return false;
  }

  const control = element.control;
  return Boolean(control && element.contains(control) && (0, _isDisabled.isDisabled)(control));
}