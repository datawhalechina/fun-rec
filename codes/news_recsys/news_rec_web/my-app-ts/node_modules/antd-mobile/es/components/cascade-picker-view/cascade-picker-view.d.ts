import { FC } from 'react';
import type { PickerViewProps } from '../picker-view';
import type { CascadePickerOption } from '../cascade-picker';
export declare type CascadePickerViewProps = Omit<PickerViewProps, 'columns'> & {
    options: CascadePickerOption[];
};
export declare const CascadePickerView: FC<CascadePickerViewProps>;
