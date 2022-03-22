import { FC } from 'react';
import { NativeProps } from '../../utils/native-props';
import { TreeSelectOption } from '.';
export declare type MultipleProps = {
    options: TreeSelectOption[];
    defaultValue?: string[];
    value?: string[];
    onChange?: (value: string[], nodes: TreeSelectOption[]) => void;
    selectAllText?: string[];
    fieldNames?: {
        label: string;
        value: string;
        children: string;
    };
    expandKeys?: string[];
    defaultExpandKeys?: string[];
    onExpand?: (expandedKeys: string[], nodes: TreeSelectOption[]) => void;
} & NativeProps;
export declare const Multiple: FC<MultipleProps>;
