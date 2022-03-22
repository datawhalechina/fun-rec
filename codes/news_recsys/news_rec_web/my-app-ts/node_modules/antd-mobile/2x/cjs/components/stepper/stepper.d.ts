import { FC } from 'react';
import { NativeProps } from '../../utils/native-props';
import { InputProps } from '../input';
declare type ValueProps = {
    allowEmpty: true;
    value?: number | null;
    defaultValue?: number | null;
    onChange?: (value: number | null) => void;
};
declare type ValuePropsWithNull = {
    allowEmpty?: false;
    value?: number;
    defaultValue?: number;
    onChange?: (value: number) => void;
};
export declare type StepperProps = Pick<InputProps, 'onFocus' | 'onBlur'> & (ValuePropsWithNull | ValueProps) & {
    min?: number;
    max?: number;
    step?: number;
    digits?: number;
    disabled?: boolean;
    inputReadOnly?: boolean;
} & NativeProps<'--height' | '--input-width' | '--input-font-size' | '--input-background-color' | '--border-radius' | '--border' | '--border-inner' | '--active-border' | '--button-font-size' | '--button-background-color' | '--button-width' | '--input-font-color' | '--button-text-color'>;
export declare const Stepper: FC<StepperProps>;
export {};
