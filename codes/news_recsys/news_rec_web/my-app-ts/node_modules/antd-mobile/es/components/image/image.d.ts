import React, { ReactNode } from 'react';
import { NativeProps } from '../../utils/native-props';
export declare type ImageProps = {
    src: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
    fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    placeholder?: ReactNode;
    fallback?: ReactNode;
    lazy?: boolean;
    onClick?: (event: React.MouseEvent<HTMLImageElement, Event>) => void;
    onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
    onLoad?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
} & NativeProps<'--width' | '--height'> & Pick<React.ImgHTMLAttributes<HTMLImageElement>, 'crossOrigin' | 'decoding' | 'loading' | 'referrerPolicy' | 'sizes' | 'srcSet' | 'useMap'>;
export declare const Image: React.FC<ImageProps>;
