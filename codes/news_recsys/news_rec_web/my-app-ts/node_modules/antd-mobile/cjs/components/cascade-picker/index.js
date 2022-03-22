"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _attachPropertiesToComponent = require("../../utils/attach-properties-to-component");

var _prompt = require("./prompt");

var _cascadePicker = require("./cascade-picker");

var _default = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_cascadePicker.CascadePicker, {
  prompt: _prompt.prompt
});

exports.default = _default;