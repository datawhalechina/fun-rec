import React from 'react';
import { PopoverProps, PopoverRef } from './popover';
export declare type Action = {
    text: React.ReactNode;
    icon?: React.ReactNode;
    disabled?: boolean;
    key?: string | number;
    onClick?: () => void;
};
export declare type PopoverMenuProps = Omit<PopoverProps, 'content'> & {
    actions: Action[];
    onAction?: (item: Action) => void;
};
export declare const PopoverMenu: React.ForwardRefExoticComponent<Omit<PopoverProps, "content"> & {
    actions: Action[];
    onAction?: ((item: Action) => void) | undefined;
} & React.RefAttributes<PopoverRef>>;
