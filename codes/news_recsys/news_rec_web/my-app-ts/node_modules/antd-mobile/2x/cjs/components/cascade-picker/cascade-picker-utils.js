"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateCascadePickerColumns = generateCascadePickerColumns;

function generateCascadePickerColumns(value, options, depth, subOptionsRecord) {
  const columns = [];
  columns.push(options.map(option => ({
    label: option.label,
    value: option.value
  })));

  for (let i = 0; i < depth - 1; i++) {
    const x = value[i];
    const subOptions = subOptionsRecord[x];

    if (!subOptions) {
      columns.push([]);
    } else {
      columns.push(subOptions.map(option => ({
        label: option.label,
        value: option.value
      })));
    }
  }

  return columns;
}