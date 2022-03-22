import { FC } from 'react';
import { NativeProps } from '../../utils/native-props';
export declare type SkeletonProps = {
    animated?: boolean;
} & NativeProps<'--width' | '--height' | '--border-radius'>;
export declare const Skeleton: FC<SkeletonProps>;
export declare type SkeletonTitleProps = {
    animated?: boolean;
} & NativeProps;
export declare const SkeletonTitle: FC<SkeletonTitleProps>;
export declare type SkeletonParagraphProps = {
    animated?: boolean;
    lineCount?: number;
} & NativeProps;
export declare const SkeletonParagraph: FC<SkeletonParagraphProps>;
