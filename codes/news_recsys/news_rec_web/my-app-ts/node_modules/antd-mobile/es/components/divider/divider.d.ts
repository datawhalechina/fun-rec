import { FC } from 'react';
import { NativeProps } from '../../utils/native-props';
export declare type DividerProps = {
    contentPosition?: 'left' | 'right' | 'center';
} & NativeProps;
export declare const Divider: FC<DividerProps>;
