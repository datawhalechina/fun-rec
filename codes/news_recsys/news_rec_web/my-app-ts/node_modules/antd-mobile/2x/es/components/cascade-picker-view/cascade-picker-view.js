import { __rest } from "tslib";
import React from 'react';
import PickerView from '../picker-view';
import { useCascadePickerOptions } from '../cascade-picker/use-cascade-picker-options';
import { generateCascadePickerColumns } from '../cascade-picker/cascade-picker-utils';
export const CascadePickerView = props => {
  const {
    options
  } = props,
        pickerProps = __rest(props, ["options"]);

  const {
    depth,
    subOptionsRecord
  } = useCascadePickerOptions(options);
  return React.createElement(PickerView, Object.assign({}, pickerProps, {
    columns: selected => generateCascadePickerColumns(selected, options, depth, subOptionsRecord)
  }));
};