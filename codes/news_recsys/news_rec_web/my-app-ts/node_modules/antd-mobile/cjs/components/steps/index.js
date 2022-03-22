"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./steps.css");

var _attachPropertiesToComponent = require("../../utils/attach-properties-to-component");

var _step = require("./step");

var _steps2 = require("./steps");

var _default = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_steps2.Steps, {
  Step: _step.Step
});

exports.default = _default;