import React, { FC } from 'react';
import { NativeProps } from '../../utils/native-props';
export declare const dot: unique symbol;
export declare type BadgeProps = {
    content?: React.ReactNode | typeof dot;
    color?: string;
    bordered?: boolean;
} & NativeProps<'--right' | '--top' | '--color'>;
export declare const Badge: FC<BadgeProps>;
