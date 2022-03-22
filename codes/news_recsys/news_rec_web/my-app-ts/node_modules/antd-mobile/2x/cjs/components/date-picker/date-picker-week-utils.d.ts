import { ReactNode } from 'react';
import { PickerColumn } from '../picker';
import type { DatePickerFilter } from './date-picker-utils';
export declare type WeekPrecision = 'year' | 'week' | 'week-day';
export declare function defaultRenderLabel(type: WeekPrecision, data: number): string;
export declare function generateDatePickerColumns(selected: string[], min: Date, max: Date, precision: WeekPrecision, renderLabel: (type: WeekPrecision, data: number) => ReactNode, filter: DatePickerFilter | undefined): PickerColumn[];
export declare function convertDateToStringArray(date: Date | undefined | null): string[];
export declare function convertStringArrayToDate(value: (string | null | undefined)[]): Date;
