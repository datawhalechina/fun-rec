"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./collapse.css");

var _attachPropertiesToComponent = require("../../utils/attach-properties-to-component");

var _collapse2 = require("./collapse");

var _default = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_collapse2.Collapse, {
  Panel: _collapse2.CollapsePanel
});

exports.default = _default;