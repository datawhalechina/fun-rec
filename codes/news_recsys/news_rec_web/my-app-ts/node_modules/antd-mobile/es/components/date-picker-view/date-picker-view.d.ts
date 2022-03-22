import { FC, ReactNode } from 'react';
import type { PickerViewProps } from '../picker-view';
import { NativeProps } from '../../utils/native-props';
import type { Precision, DatePickerFilter } from '../date-picker/date-picker-utils';
export declare type DatePickerViewProps = Pick<PickerViewProps, 'style'> & {
    value?: Date;
    defaultValue?: Date;
    onChange?: (value: Date) => void;
    min?: Date;
    max?: Date;
    precision?: Precision;
    renderLabel?: (type: Precision, data: number) => ReactNode;
    filter?: DatePickerFilter;
} & NativeProps;
export declare const DatePickerView: FC<DatePickerViewProps>;
