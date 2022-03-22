import { FC } from 'react';
import type { PickerProps } from '../picker';
export declare type CascadePickerOption = {
    label: string;
    value: string;
    children?: CascadePickerOption[];
};
export declare type CascadePickerProps = Omit<PickerProps, 'columns'> & {
    options: CascadePickerOption[];
};
export declare const CascadePicker: FC<CascadePickerProps>;
