import React, { FC } from 'react';
import { NativeProps } from '../../utils/native-props';
export declare type ButtonProps = {
    color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
    fill?: 'solid' | 'outline' | 'none';
    size?: 'mini' | 'small' | 'middle' | 'large';
    block?: boolean;
    loading?: boolean;
    loadingText?: string;
    disabled?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    type?: 'submit' | 'reset' | 'button';
    shape?: 'default' | 'rounded' | 'rectangular';
} & NativeProps<'--text-color' | '--background-color' | '--border-radius' | '--border-width' | '--border-style' | '--border-color'>;
export declare const Button: FC<ButtonProps>;
