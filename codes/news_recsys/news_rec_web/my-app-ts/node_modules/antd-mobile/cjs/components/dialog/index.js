"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./dialog.css");

var _show = require("./show");

var _alert = require("./alert");

var _confirm = require("./confirm");

var _clear = require("./clear");

var _attachPropertiesToComponent = require("../../utils/attach-properties-to-component");

var _dialog2 = require("./dialog");

var _default = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_dialog2.Dialog, {
  show: _show.show,
  alert: _alert.alert,
  confirm: _confirm.confirm,
  clear: _clear.clear
});

exports.default = _default;