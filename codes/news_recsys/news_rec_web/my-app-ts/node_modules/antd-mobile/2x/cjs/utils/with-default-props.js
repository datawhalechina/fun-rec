"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeProps = mergeProps;

var _assign = _interopRequireDefault(require("lodash/assign"));

var _assignWith = _interopRequireDefault(require("lodash/assignWith"));

var _isUndefined = _interopRequireDefault(require("lodash/isUndefined"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mergeProps(...items) {
  function customizer(objValue, srcValue) {
    return (0, _isUndefined.default)(srcValue) ? objValue : srcValue;
  }

  let ret = (0, _assign.default)({}, items[0]);

  for (let i = 1; i < items.length; i++) {
    ret = (0, _assignWith.default)(ret, items[i], customizer);
  }

  return ret;
}