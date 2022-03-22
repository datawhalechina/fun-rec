"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./list.css");

var _attachPropertiesToComponent = require("../../utils/attach-properties-to-component");

var _list2 = require("./list");

var _listItem = require("./list-item");

var _default = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_list2.List, {
  Item: _listItem.ListItem
});

exports.default = _default;