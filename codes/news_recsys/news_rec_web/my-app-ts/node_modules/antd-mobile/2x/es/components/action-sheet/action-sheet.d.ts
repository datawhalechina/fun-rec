import React, { FC, ReactNode } from 'react';
import { NativeProps } from '../../utils/native-props';
import { GetContainer } from '../../utils/render-to-container';
export declare type Action = {
    key: string | number;
    text: ReactNode;
    disabled?: boolean;
    description?: ReactNode;
    danger?: boolean;
    onClick?: () => void;
};
export declare type ActionSheetProps = {
    visible?: boolean;
    actions: Action[];
    extra?: React.ReactNode;
    cancelText?: React.ReactNode;
    onAction?: (action: Action, index: number) => void;
    onClose?: () => void;
    afterClose?: () => void;
    onMaskClick?: () => void;
    closeOnAction?: boolean;
    closeOnMaskClick?: boolean;
    getContainer?: GetContainer;
    safeArea?: boolean;
    popupClassName?: string;
    popupStyle?: React.CSSProperties;
} & NativeProps;
export declare const ActionSheet: FC<ActionSheetProps>;
export declare type ActionSheetShowHandler = {
    close: () => void;
};
export declare function showActionSheet(props: Omit<ActionSheetProps, 'visible'>): ActionSheetShowHandler;
