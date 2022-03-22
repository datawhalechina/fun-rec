"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./dropdown.css");

var _dropdown2 = _interopRequireDefault(require("./dropdown"));

var _attachPropertiesToComponent = require("../../utils/attach-properties-to-component");

var _item = _interopRequireDefault(require("./item"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_dropdown2.default, {
  Item: _item.default
});

exports.default = _default;