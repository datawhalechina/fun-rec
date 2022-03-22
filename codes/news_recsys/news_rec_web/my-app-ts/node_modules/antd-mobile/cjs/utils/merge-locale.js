"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeLocale = mergeLocale;

var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));

var _merge = _interopRequireDefault(require("lodash/merge"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mergeLocale(base, patch) {
  return (0, _merge.default)((0, _cloneDeep.default)(base), patch);
}