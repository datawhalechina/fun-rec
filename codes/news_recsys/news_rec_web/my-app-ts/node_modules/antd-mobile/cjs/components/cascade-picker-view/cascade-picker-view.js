"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CascadePickerView = void 0;

var _tslib = require("tslib");

var _react = _interopRequireDefault(require("react"));

var _pickerView = _interopRequireDefault(require("../picker-view"));

var _useCascadePickerOptions = require("../cascade-picker/use-cascade-picker-options");

var _cascadePickerUtils = require("../cascade-picker/cascade-picker-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CascadePickerView = props => {
  const {
    options
  } = props,
        pickerProps = (0, _tslib.__rest)(props, ["options"]);
  const {
    depth,
    subOptionsRecord
  } = (0, _useCascadePickerOptions.useCascadePickerOptions)(options);
  return _react.default.createElement(_pickerView.default, Object.assign({}, pickerProps, {
    columns: selected => (0, _cascadePickerUtils.generateCascadePickerColumns)(selected, options, depth, subOptionsRecord)
  }));
};

exports.CascadePickerView = CascadePickerView;