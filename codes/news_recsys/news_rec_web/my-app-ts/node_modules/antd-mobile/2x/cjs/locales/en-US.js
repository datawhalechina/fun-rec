"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mergeLocale = require("../utils/merge-locale");

var _base = require("./base");

const enUS = (0, _mergeLocale.mergeLocale)(_base.base, {});
var _default = enUS;
exports.default = _default;