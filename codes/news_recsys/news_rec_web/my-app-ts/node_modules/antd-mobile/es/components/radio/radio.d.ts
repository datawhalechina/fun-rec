import React, { FC } from 'react';
import { NativeProps } from '../../utils/native-props';
export declare type RadioValue = string | number;
export declare type RadioProps = {
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
    value?: RadioValue;
    block?: boolean;
    id?: string;
    icon?: (checked: boolean) => React.ReactNode;
} & NativeProps<'--icon-size' | '--font-size' | '--gap'>;
export declare const Radio: FC<RadioProps>;
