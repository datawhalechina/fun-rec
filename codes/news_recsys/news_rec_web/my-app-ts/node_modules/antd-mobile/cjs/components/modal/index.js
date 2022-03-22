"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./modal.css");

var _show = require("./show");

var _alert = require("./alert");

var _confirm = require("./confirm");

var _clear = require("./clear");

var _attachPropertiesToComponent = require("../../utils/attach-properties-to-component");

var _modal2 = require("./modal");

var _default = (0, _attachPropertiesToComponent.attachPropertiesToComponent)(_modal2.Modal, {
  show: _show.show,
  alert: _alert.alert,
  confirm: _confirm.confirm,
  clear: _clear.clear
});

exports.default = _default;