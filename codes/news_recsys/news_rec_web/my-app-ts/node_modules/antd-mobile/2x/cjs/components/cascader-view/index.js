"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./cascader-view.css");

var _cascaderView2 = require("./cascader-view");

var _attachPropertiesToComponent = require("../../utils/attach-properties-to-component");

var _optionSkeleton = require("./option-skeleton");

var _default = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_cascaderView2.CascaderView, {
  optionSkeleton: _optionSkeleton.optionSkeleton
});

exports.default = _default;