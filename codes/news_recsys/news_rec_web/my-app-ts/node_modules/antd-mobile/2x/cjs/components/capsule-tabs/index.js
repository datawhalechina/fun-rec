"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./capsule-tabs.css");

var _capsuleTabs2 = require("./capsule-tabs");

var _attachPropertiesToComponent = require("../../utils/attach-properties-to-component");

var _default = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_capsuleTabs2.CapsuleTabs, {
  Tab: _capsuleTabs2.CapsuleTab
});

exports.default = _default;