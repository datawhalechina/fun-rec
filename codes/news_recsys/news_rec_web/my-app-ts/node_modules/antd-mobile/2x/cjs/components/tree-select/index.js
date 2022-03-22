"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./tree-select.css");

var _treeSelect2 = require("./tree-select");

var _attachPropertiesToComponent = require("../../utils/attach-properties-to-component");

var _multiple = require("./multiple");

var _default = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_treeSelect2.TreeSelect, {
  Multiple: _multiple.Multiple
});

exports.default = _default;