"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.devError = devError;
exports.devWarning = devWarning;

var _isDev = require("./is-dev");

function devWarning(component, message) {
  if (_isDev.isDev) {
    console.warn(`[antd-mobile: ${component}] ${message}`);
  }
}

function devError(component, message) {
  if (_isDev.isDev) {
    console.error(`[antd-mobile: ${component}] ${message}`);
  }
}