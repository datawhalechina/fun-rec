import { __rest } from "tslib";
import React from 'react';
import Picker from '../picker';
import { useCascadePickerOptions } from './use-cascade-picker-options';
import { generateCascadePickerColumns } from './cascade-picker-utils';
export const CascadePicker = props => {
  const {
    options
  } = props,
        pickerProps = __rest(props, ["options"]);

  const {
    depth,
    subOptionsRecord
  } = useCascadePickerOptions(options);
  return React.createElement(Picker, Object.assign({}, pickerProps, {
    columns: selected => generateCascadePickerColumns(selected, options, depth, subOptionsRecord)
  }));
};