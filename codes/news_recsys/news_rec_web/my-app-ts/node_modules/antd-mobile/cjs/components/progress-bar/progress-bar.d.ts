import { FC } from 'react';
import { NativeProps } from '../../utils/native-props';
export declare type ProgressBarProps = {
    percent?: number;
} & NativeProps<'--track-width' | '--track-color' | '--fill-color'>;
export declare const ProgressBar: FC<ProgressBarProps>;
