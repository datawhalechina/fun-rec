import * as dateUtils from './date-picker-date-utils';
import * as weekUtils from './date-picker-week-utils';
export const convertDateToStringArray = (date, precision) => {
  if (precision.includes('week')) {
    return weekUtils.convertDateToStringArray(date);
  } else {
    return dateUtils.convertDateToStringArray(date);
  }
};
export const convertStringArrayToDate = (value, precision) => {
  if (precision.includes('week')) {
    return weekUtils.convertStringArrayToDate(value);
  } else {
    return dateUtils.convertStringArrayToDate(value);
  }
};
export const generateDatePickerColumns = (selected, min, max, precision, renderLabel, filter) => {
  if (precision.startsWith('week')) {
    return weekUtils.generateDatePickerColumns(selected, min, max, precision, renderLabel, filter);
  } else {
    return dateUtils.generateDatePickerColumns(selected, min, max, precision, renderLabel, filter);
  }
};
export const defaultRenderLabel = (precision, data) => {
  if (precision.includes('week')) {
    return weekUtils.defaultRenderLabel(precision, data);
  } else {
    return dateUtils.defaultRenderLabel(precision, data);
  }
};