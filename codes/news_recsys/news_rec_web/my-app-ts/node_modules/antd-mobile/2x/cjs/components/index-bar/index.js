"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./index-bar.css");

var _attachPropertiesToComponent = require("../../utils/attach-properties-to-component");

var _panel = require("./panel");

var _indexBar2 = require("./index-bar");

var _default = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_indexBar2.IndexBar, {
  Panel: _panel.Panel
});

exports.default = _default;