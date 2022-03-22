import React from 'react';
import { NativeProps } from '../../utils/native-props';
export declare type PageIndicatorProps = {
    total: number;
    current: number;
    direction?: 'horizontal' | 'vertical';
    color?: 'primary' | 'white';
} & NativeProps<'--dot-color' | '--active-dot-color' | '--dot-size' | '--active-dot-size' | '--dot-border-radius' | '--active-dot-border-radius' | '--dot-spacing'>;
export declare const PageIndicator: React.NamedExoticComponent<PageIndicatorProps>;
