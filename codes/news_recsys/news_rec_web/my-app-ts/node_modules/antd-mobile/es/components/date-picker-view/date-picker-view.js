import React, { useCallback, useMemo } from 'react';
import PickerView from '../picker-view';
import { withNativeProps } from '../../utils/native-props';
import { mergeProps } from '../../utils/with-default-props';
import { usePropsValue } from '../../utils/use-props-value';
import { generateDatePickerColumns, convertDateToStringArray, convertStringArrayToDate, defaultRenderLabel } from '../date-picker/date-picker-utils';
const thisYear = new Date().getFullYear();
const defaultProps = {
  min: new Date(new Date().setFullYear(thisYear - 10)),
  max: new Date(new Date().setFullYear(thisYear + 10)),
  precision: 'day',
  renderLabel: defaultRenderLabel
};
export const DatePickerView = p => {
  var _a;

  const props = mergeProps(defaultProps, p);
  const [value, setValue] = usePropsValue({
    value: props.value,
    defaultValue: (_a = props.defaultValue) !== null && _a !== void 0 ? _a : null
  });
  const pickerValue = useMemo(() => convertDateToStringArray(value, props.precision), [value, props.precision]);
  const onChange = useCallback(val => {
    var _a;

    const date = convertStringArrayToDate(val, props.precision);

    if (date) {
      setValue(date);
      (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, date);
    }
  }, [props.onChange, props.precision]);
  return withNativeProps(props, React.createElement(PickerView, {
    columns: selected => generateDatePickerColumns(selected, props.min, props.max, props.precision, props.renderLabel, props.filter),
    value: pickerValue,
    onChange: onChange
  }));
};