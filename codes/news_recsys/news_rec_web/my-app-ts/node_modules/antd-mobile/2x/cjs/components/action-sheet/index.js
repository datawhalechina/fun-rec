"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./action-sheet.css");

var _attachPropertiesToComponent = require("../../utils/attach-properties-to-component");

var _actionSheet2 = require("./action-sheet");

var _default = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_actionSheet2.ActionSheet, {
  show: _actionSheet2.showActionSheet
});

exports.default = _default;