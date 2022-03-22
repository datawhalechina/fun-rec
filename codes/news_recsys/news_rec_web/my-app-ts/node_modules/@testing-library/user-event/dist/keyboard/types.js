"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DOM_KEY_LOCATION = void 0;

/**
 * @internal Do not create/alter this by yourself as this type might be subject to changes.
 */
let DOM_KEY_LOCATION;
exports.DOM_KEY_LOCATION = DOM_KEY_LOCATION;

(function (DOM_KEY_LOCATION) {
  DOM_KEY_LOCATION[DOM_KEY_LOCATION["STANDARD"] = 0] = "STANDARD";
  DOM_KEY_LOCATION[DOM_KEY_LOCATION["LEFT"] = 1] = "LEFT";
  DOM_KEY_LOCATION[DOM_KEY_LOCATION["RIGHT"] = 2] = "RIGHT";
  DOM_KEY_LOCATION[DOM_KEY_LOCATION["NUMPAD"] = 3] = "NUMPAD";
})(DOM_KEY_LOCATION || (exports.DOM_KEY_LOCATION = DOM_KEY_LOCATION = {}));