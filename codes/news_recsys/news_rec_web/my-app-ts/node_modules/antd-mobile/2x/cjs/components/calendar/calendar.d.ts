import React from 'react';
import { NativeProps } from '../../utils/native-props';
declare type Page = {
    month: number;
    year: number;
};
export declare type CalenderRef = {
    jumpTo: (page: Page | ((page: Page) => Page)) => void;
    jumpToToday: () => void;
};
export declare type CalendarProps = {
    onPageChange?: (year: number, month: number) => void;
    weekStartsOn?: 'Monday' | 'Sunday';
    renderLabel?: (date: Date) => string | null | undefined;
    allowClear?: boolean;
} & ({
    selectionMode?: undefined;
    value?: undefined;
    defaultValue?: undefined;
    onChange?: undefined;
} | {
    selectionMode: 'single';
    value?: Date | null;
    defaultValue?: Date | null;
    onChange?: (val: Date | null) => void;
} | {
    selectionMode: 'range';
    value?: [Date, Date] | null;
    defaultValue?: [Date, Date] | null;
    onChange?: (val: [Date, Date] | null) => void;
}) & NativeProps;
export declare const Calendar: React.ForwardRefExoticComponent<CalendarProps & React.RefAttributes<CalenderRef>>;
export {};
