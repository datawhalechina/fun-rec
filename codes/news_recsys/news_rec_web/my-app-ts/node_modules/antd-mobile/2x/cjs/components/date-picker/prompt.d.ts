import { DatePickerProps } from './date-picker';
export declare function prompt(props: Omit<DatePickerProps, 'value' | 'visible' | 'children'>): Promise<Date | null>;
