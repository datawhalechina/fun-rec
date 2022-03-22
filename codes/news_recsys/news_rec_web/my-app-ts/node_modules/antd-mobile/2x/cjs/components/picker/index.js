"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./picker.css");

var _attachPropertiesToComponent = require("../../utils/attach-properties-to-component");

var _picker2 = require("./picker");

var _prompt = require("./prompt");

var _default = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_picker2.Picker, {
  prompt: _prompt.prompt
});

exports.default = _default;