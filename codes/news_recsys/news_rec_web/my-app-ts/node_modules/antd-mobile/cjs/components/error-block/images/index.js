"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.imageRecord = void 0;

var _default = require("./default");

var _disconnected = require("./disconnected");

var _empty = require("./empty");

var _busy = require("./busy");

const imageRecord = {
  'default': _default.defaultImage,
  'disconnected': _disconnected.disconnectedImage,
  'empty': _empty.emptyImage,
  'busy': _busy.busyImage
};
exports.imageRecord = imageRecord;