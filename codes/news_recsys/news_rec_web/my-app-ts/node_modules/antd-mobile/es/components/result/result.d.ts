import { FC, ReactNode } from 'react';
import { NativeProps } from '../../utils/native-props';
export declare type ResultProps = {
    status: 'success' | 'error' | 'info' | 'waiting' | 'warning';
    title: ReactNode;
    description?: ReactNode;
    icon?: ReactNode;
} & NativeProps;
export declare const Result: FC<ResultProps>;
