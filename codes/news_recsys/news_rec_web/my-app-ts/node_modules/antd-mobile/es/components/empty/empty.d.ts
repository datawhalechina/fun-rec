import React, { ReactNode } from 'react';
import { NativeProps } from '../../utils/native-props';
export declare type EmptyProps = {
    image?: ReactNode;
    imageStyle?: React.CSSProperties;
    description?: ReactNode;
} & NativeProps;
export declare const Empty: React.FC<EmptyProps>;
