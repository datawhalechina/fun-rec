import { ReactNode } from 'react';
import { PickerColumn } from '../picker';
import type { DatePickerFilter } from './date-picker-utils';
export declare type DatePrecision = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';
export declare function defaultRenderLabel(type: DatePrecision, data: number): string;
export declare function generateDatePickerColumns(selected: string[], min: Date, max: Date, precision: DatePrecision, renderLabel: (type: DatePrecision, data: number) => ReactNode, filter: DatePickerFilter | undefined): PickerColumn[];
export declare function convertDateToStringArray(date: Date | undefined | null): string[];
export declare function convertStringArrayToDate(value: (string | null | undefined)[]): Date;
