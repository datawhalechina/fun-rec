import React, { FC } from 'react';
import { NativeProps } from '../../utils/native-props';
declare type Props = {
    onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
} & NativeProps;
export declare const SwiperItem: FC<Props>;
export {};
