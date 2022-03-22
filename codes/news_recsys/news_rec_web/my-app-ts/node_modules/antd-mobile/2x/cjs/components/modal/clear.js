"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clear = clear;

var _show = require("./show");

function clear() {
  _show.closeFnSet.forEach(close => {
    close();
  });
}