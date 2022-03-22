"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./badge.css");

var _badge2 = require("./badge");

var _attachPropertiesToComponent = require("../../utils/attach-properties-to-component");

var _default = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_badge2.Badge, {
  dot: _badge2.dot
});

exports.default = _default;