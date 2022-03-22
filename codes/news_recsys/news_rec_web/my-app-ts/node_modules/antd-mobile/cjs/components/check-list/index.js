"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./check-list.css");

var _checkList2 = require("./check-list");

var _attachPropertiesToComponent = require("../../utils/attach-properties-to-component");

var _checkListItem = require("./check-list-item");

var _default = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_checkList2.CheckList, {
  Item: _checkListItem.CheckListItem
});

exports.default = _default;