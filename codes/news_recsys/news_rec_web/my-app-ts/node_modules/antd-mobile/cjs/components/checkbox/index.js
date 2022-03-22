"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./checkbox.css");

var _attachPropertiesToComponent = require("../../utils/attach-properties-to-component");

var _group = require("./group");

var _checkbox2 = require("./checkbox");

var _default = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_checkbox2.Checkbox, {
  Group: _group.Group
});

exports.default = _default;