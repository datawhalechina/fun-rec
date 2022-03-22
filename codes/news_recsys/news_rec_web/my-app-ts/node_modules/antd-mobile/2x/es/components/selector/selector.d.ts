import React, { ReactNode } from 'react';
import { NativeProps } from '../../utils/native-props';
declare type SelectorValue = string | number;
export interface SelectorOption<V> {
    label: ReactNode;
    description?: ReactNode;
    value: V;
    disabled?: boolean;
}
export declare type SelectorProps<V> = {
    options: SelectorOption<V>[];
    columns?: number;
    multiple?: boolean;
    disabled?: boolean;
    defaultValue?: V[];
    value?: V[];
    onChange?: (v: V[], extend: {
        items: SelectorOption<V>[];
    }) => void;
    showCheckMark?: boolean;
} & NativeProps<'--color' | '--checked-color' | '--text-color' | '--checked-text-color' | '--border' | '--checked-border' | '--border-radius' | '--padding'>;
export declare const Selector: <V extends SelectorValue>(p: SelectorProps<V>) => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
export {};
