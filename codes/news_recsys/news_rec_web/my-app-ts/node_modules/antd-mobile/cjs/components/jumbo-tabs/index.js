"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./jumbo-tabs.css");

var _jumboTabs2 = require("./jumbo-tabs");

var _attachPropertiesToComponent = require("../../utils/attach-properties-to-component");

var _default = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_jumboTabs2.JumboTabs, {
  Tab: _jumboTabs2.JumboTab
});

exports.default = _default;