import { FC } from 'react';
import { NativeProps } from '../../utils/native-props';
import { SliderMarks } from './marks';
export declare type SliderValue = number | [number, number];
export declare type SliderProps = {
    min?: number;
    max?: number;
    value?: SliderValue;
    defaultValue?: SliderValue;
    step?: number;
    marks?: SliderMarks;
    ticks?: boolean;
    disabled?: boolean;
    range?: boolean;
    onChange?: (value: SliderValue) => void;
    onAfterChange?: (value: SliderValue) => void;
} & NativeProps<'--fill-color'>;
export declare const Slider: FC<SliderProps>;
