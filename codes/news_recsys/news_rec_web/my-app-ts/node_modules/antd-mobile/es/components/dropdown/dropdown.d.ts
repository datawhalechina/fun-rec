import React from 'react';
import { NativeProps } from '../../utils/native-props';
export declare type DropdownProps = {
    activeKey?: string | null;
    defaultActiveKey?: string | null;
    closeOnMaskClick?: boolean;
    closeOnClickAway?: boolean;
    onChange?: (key: string | null) => void;
    arrow?: React.ReactNode;
} & NativeProps;
export declare type DropdownRef = {
    close: () => void;
};
declare const Dropdown: React.ForwardRefExoticComponent<{
    activeKey?: string | null | undefined;
    defaultActiveKey?: string | null | undefined;
    closeOnMaskClick?: boolean | undefined;
    closeOnClickAway?: boolean | undefined;
    onChange?: ((key: string | null) => void) | undefined;
    arrow?: React.ReactNode;
} & NativeProps<never> & {
    children?: React.ReactNode;
} & React.RefAttributes<DropdownRef>>;
export default Dropdown;
