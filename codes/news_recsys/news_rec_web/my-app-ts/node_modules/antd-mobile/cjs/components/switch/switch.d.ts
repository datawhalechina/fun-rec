import { FC, ReactNode } from 'react';
import { NativeProps } from '../../utils/native-props';
export declare type SwitchProps = {
    loading?: boolean;
    disabled?: boolean;
    checked?: boolean;
    defaultChecked?: boolean;
    beforeChange?: (val: boolean) => Promise<void>;
    onChange?: (checked: boolean) => void;
    checkedText?: ReactNode;
    uncheckedText?: ReactNode;
} & NativeProps<'--checked-color' | '--width' | '--height' | '--border-width'>;
export declare const Switch: FC<SwitchProps>;
