import React, { FC } from 'react';
import { NativeProps } from '../../utils/native-props';
export declare type RateProps = {
    allowClear?: boolean;
    allowHalf?: boolean;
    character?: React.ReactNode;
    count?: number;
    defaultValue?: number;
    readOnly?: boolean;
    value?: number;
    onChange?: (value: number) => void;
} & NativeProps<'--star-size' | '--active-color' | '--inactive-color'>;
export declare const Rate: FC<RateProps>;
