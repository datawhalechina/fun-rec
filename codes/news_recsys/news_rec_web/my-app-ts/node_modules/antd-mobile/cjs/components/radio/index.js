"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./radio.css");

var _attachPropertiesToComponent = require("../../utils/attach-properties-to-component");

var _group = require("./group");

var _radio2 = require("./radio");

var _default = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_radio2.Radio, {
  Group: _group.Group
});

exports.default = _default;