"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./date-picker.css");

var _attachPropertiesToComponent = require("../../utils/attach-properties-to-component");

var _datePicker2 = require("./date-picker");

var _prompt = require("./prompt");

var _default = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_datePicker2.DatePicker, {
  prompt: _prompt.prompt
});

exports.default = _default;