"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./side-bar.css");

var _sideBar2 = require("./side-bar");

var _attachPropertiesToComponent = require("../../utils/attach-properties-to-component");

var _default = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_sideBar2.SideBar, {
  Item: _sideBar2.SideBarItem
});

exports.default = _default;