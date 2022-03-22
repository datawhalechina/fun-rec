import { ReactNode } from 'react';
import type { DatePrecision } from './date-picker-date-utils';
import type { WeekPrecision } from './date-picker-week-utils';
export declare type Precision = DatePrecision | WeekPrecision;
export declare type DatePickerFilter = Partial<Record<Precision, (val: number, extend: {
    date: Date;
}) => boolean>>;
export declare const convertDateToStringArray: (date: Date | undefined | null, precision: Precision) => string[];
export declare const convertStringArrayToDate: (value: (string | null | undefined)[], precision: Precision) => Date;
export declare const generateDatePickerColumns: (selected: string[], min: Date, max: Date, precision: Precision, renderLabel: (type: Precision, data: number) => ReactNode, filter: DatePickerFilter | undefined) => import("../picker-view").PickerColumn[];
export declare const defaultRenderLabel: (precision: Precision, data: number) => string;
