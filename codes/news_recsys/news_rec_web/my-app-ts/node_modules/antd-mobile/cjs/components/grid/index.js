"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./grid.css");

var _attachPropertiesToComponent = require("../../utils/attach-properties-to-component");

var _grid2 = require("./grid");

var _default = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_grid2.Grid, {
  Item: _grid2.GridItem
});

exports.default = _default;