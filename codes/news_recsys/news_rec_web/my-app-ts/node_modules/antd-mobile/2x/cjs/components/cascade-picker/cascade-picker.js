"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CascadePicker = void 0;

var _tslib = require("tslib");

var _react = _interopRequireDefault(require("react"));

var _picker = _interopRequireDefault(require("../picker"));

var _useCascadePickerOptions = require("./use-cascade-picker-options");

var _cascadePickerUtils = require("./cascade-picker-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CascadePicker = props => {
  const {
    options
  } = props,
        pickerProps = (0, _tslib.__rest)(props, ["options"]);
  const {
    depth,
    subOptionsRecord
  } = (0, _useCascadePickerOptions.useCascadePickerOptions)(options);
  return _react.default.createElement(_picker.default, Object.assign({}, pickerProps, {
    columns: selected => (0, _cascadePickerUtils.generateCascadePickerColumns)(selected, options, depth, subOptionsRecord)
  }));
};

exports.CascadePicker = CascadePicker;