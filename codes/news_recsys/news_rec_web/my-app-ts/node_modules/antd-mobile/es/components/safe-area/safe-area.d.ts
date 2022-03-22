import { FC } from 'react';
import { NativeProps } from '../../utils/native-props';
export declare type SafeAreaProps = {
    position: 'top' | 'bottom';
} & NativeProps;
export declare const SafeArea: FC<SafeAreaProps>;
