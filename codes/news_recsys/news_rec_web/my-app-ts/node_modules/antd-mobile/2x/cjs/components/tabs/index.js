"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./tabs.css");

var _tabs2 = require("./tabs");

var _attachPropertiesToComponent = require("../../utils/attach-properties-to-component");

var _default = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_tabs2.Tabs, {
  Tab: _tabs2.Tab
});

exports.default = _default;