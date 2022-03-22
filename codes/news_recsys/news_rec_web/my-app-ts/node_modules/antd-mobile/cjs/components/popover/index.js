"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./popover.css");

require("./popover-menu.css");

var _attachPropertiesToComponent = require("../../utils/attach-properties-to-component");

var _popoverMenu2 = require("./popover-menu");

var _popover2 = require("./popover");

var _default = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_popover2.Popover, {
  Menu: _popoverMenu2.PopoverMenu
});

exports.default = _default;