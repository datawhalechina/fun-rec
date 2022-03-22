import React, { ReactNode } from 'react';
import { NativeProps } from '../../utils/native-props';
export declare type IndexBarProps = {
    sticky?: boolean;
    children?: React.ReactNode;
} & NativeProps<'--sticky-offset-top'>;
export declare type IndexBarRef = {
    scrollTo: (index: string) => void;
};
export declare const IndexBar: React.ForwardRefExoticComponent<{
    sticky?: boolean | undefined;
    children?: React.ReactNode;
} & NativeProps<"--sticky-offset-top"> & React.RefAttributes<IndexBarRef>>;
