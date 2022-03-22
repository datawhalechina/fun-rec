import { DialogProps } from './index';
import { ReactNode } from 'react';
export declare type DialogConfirmProps = Omit<DialogProps, 'visible' | 'closeOnAction' | 'actions'> & {
    confirmText?: ReactNode;
    cancelText?: ReactNode;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void | Promise<void>;
};
export declare function confirm(p: DialogConfirmProps): Promise<boolean>;
