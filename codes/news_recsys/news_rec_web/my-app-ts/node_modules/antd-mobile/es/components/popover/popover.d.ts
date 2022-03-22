import React, { ReactElement } from 'react';
import { NativeProps } from '../../utils/native-props';
import { PropagationEvent } from '../../utils/with-stop-propagation';
import { GetContainer } from '../../utils/render-to-container';
import { DeprecatedPlacement, Placement } from './index';
export declare type PopoverProps = {
    defaultVisible?: boolean;
    visible?: boolean;
    onVisibleChange?: (visible: boolean) => void;
    getContainer?: GetContainer;
    destroyOnHide?: boolean;
    children: ReactElement;
    mode?: 'light' | 'dark';
    trigger?: 'click';
    placement?: Placement | DeprecatedPlacement;
    stopPropagation?: PropagationEvent[];
    content: React.ReactNode;
} & NativeProps<'--z-index'>;
export declare type PopoverRef = {
    show: () => void;
    hide: () => void;
    visible: boolean;
};
export declare const Popover: React.ForwardRefExoticComponent<{
    defaultVisible?: boolean | undefined;
    visible?: boolean | undefined;
    onVisibleChange?: ((visible: boolean) => void) | undefined;
    getContainer?: GetContainer | undefined;
    destroyOnHide?: boolean | undefined;
    children: ReactElement;
    mode?: "dark" | "light" | undefined;
    trigger?: "click" | undefined;
    placement?: DeprecatedPlacement | Placement | undefined;
    stopPropagation?: "click"[] | undefined;
    content: React.ReactNode;
} & NativeProps<"--z-index"> & React.RefAttributes<PopoverRef>>;
