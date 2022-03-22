"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./toast.css");

var _methods = require("./methods");

const Toast = {
  show: _methods.show,
  clear: _methods.clear,
  config: _methods.config
};
var _default = Toast;
exports.default = _default;