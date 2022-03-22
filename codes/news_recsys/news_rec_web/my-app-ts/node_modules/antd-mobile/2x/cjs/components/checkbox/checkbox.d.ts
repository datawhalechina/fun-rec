import React, { FC } from 'react';
import { NativeProps } from '../../utils/native-props';
export declare type CheckboxValue = string | number;
export declare type CheckboxProps = {
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
    value?: CheckboxValue;
    indeterminate?: boolean;
    block?: boolean;
    id?: string;
    icon?: (checked: boolean, indeterminate: boolean) => React.ReactNode;
} & NativeProps<'--icon-size' | '--font-size' | '--gap'>;
export declare const Checkbox: FC<CheckboxProps>;
