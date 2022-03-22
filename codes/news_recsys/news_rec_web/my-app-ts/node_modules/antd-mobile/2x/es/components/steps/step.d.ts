import React, { FC } from 'react';
import { NativeProps } from '../../utils/native-props';
export declare type StepProps = {
    title?: React.ReactNode;
    description?: React.ReactNode;
    icon?: React.ReactNode;
    status?: 'wait' | 'process' | 'finish' | 'error';
} & NativeProps;
export declare const Step: FC<StepProps>;
