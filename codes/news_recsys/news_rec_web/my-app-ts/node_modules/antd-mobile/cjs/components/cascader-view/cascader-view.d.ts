import { FC } from 'react';
import { NativeProps } from '../../utils/native-props';
export declare type CascaderValue = string;
export declare type CascaderOption = {
    label: string;
    value: string;
    disabled?: boolean;
    children?: CascaderOption[];
};
export declare type CascaderValueExtend = {
    items: (CascaderOption | null)[];
    isLeaf: boolean;
};
export declare type CascaderViewProps = {
    options: CascaderOption[];
    value?: CascaderValue[];
    defaultValue?: CascaderValue[];
    onChange?: (value: CascaderValue[], extend: CascaderValueExtend) => void;
    placeholder?: string;
} & NativeProps<'--height'>;
export declare const CascaderView: FC<CascaderViewProps>;
