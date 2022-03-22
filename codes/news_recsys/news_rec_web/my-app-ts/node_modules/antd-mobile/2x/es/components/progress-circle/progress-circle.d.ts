import React, { FC } from 'react';
import { NativeProps } from '../../utils/native-props';
export declare type ProgressCircleProps = {
    percent?: number;
    children?: React.ReactNode;
} & NativeProps<'--size' | '--track-width' | '--track-color' | '--fill-color'>;
export declare const ProgressCircle: FC<ProgressCircleProps>;
