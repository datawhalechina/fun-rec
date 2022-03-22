"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./tab-bar.css");

var _tabBar2 = require("./tab-bar");

var _attachPropertiesToComponent = require("../../utils/attach-properties-to-component");

var _default = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_tabBar2.TabBar, {
  Item: _tabBar2.TabBarItem
});

exports.default = _default;