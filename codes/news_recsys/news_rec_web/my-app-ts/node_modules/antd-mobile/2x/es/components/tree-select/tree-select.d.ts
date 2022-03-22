import { FC } from 'react';
import { NativeProps } from '../../utils/native-props';
export interface TreeSelectOption {
    [key: string]: any;
}
export declare type TreeSelectProps = {
    options: TreeSelectOption[];
    defaultValue?: string[];
    value?: string[];
    onChange?: (value: string[], extend: {
        options: TreeSelectOption[];
    }) => void;
    fieldNames?: {
        label: string;
        value: string;
        children: string;
    };
} & NativeProps;
export declare const TreeSelect: FC<TreeSelectProps>;
