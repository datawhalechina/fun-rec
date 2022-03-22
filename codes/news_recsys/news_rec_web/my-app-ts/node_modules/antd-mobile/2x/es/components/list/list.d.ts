import { FC, ReactNode } from 'react';
import { NativeProps } from '../../utils/native-props';
export declare type ListProps = {
    header?: ReactNode;
    mode?: 'default' | 'card';
} & NativeProps<'--header-font-size' | '--prefix-width' | '--prefix-padding-right' | '--align-items' | '--active-background-color' | '--border-inner' | '--border-top' | '--border-bottom' | '--padding-left' | '--padding-right' | '--font-size'>;
export declare const List: FC<ListProps>;
