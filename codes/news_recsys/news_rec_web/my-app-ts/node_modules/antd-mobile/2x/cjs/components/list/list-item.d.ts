import React, { FC, ReactNode } from 'react';
import { NativeProps } from '../../utils/native-props';
export declare type ListItemProps = {
    title?: ReactNode;
    children?: ReactNode;
    description?: ReactNode;
    prefix?: ReactNode;
    extra?: ReactNode;
    clickable?: boolean;
    arrow?: boolean | ReactNode;
    disabled?: boolean;
    onClick?: (e: React.MouseEvent) => void;
} & NativeProps<'--prefix-width' | '--align-items' | '--active-background-color'>;
export declare const ListItem: FC<ListItemProps>;
