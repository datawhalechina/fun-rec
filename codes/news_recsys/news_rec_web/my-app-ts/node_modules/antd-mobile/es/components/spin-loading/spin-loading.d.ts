import React from 'react';
import { NativeProps } from '../../utils/native-props';
export declare type SpinLoadingProps = {
    color?: 'default' | 'primary' | 'white' | (string & {});
} & NativeProps<'--color' | '--size'>;
export declare const SpinLoading: React.NamedExoticComponent<SpinLoadingProps>;
