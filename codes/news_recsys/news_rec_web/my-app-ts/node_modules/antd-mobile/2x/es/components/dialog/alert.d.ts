import { DialogProps } from './index';
import { ReactNode } from 'react';
export declare type DialogAlertProps = Omit<DialogProps, 'visible' | 'closeOnAction' | 'actions'> & {
    confirmText?: ReactNode;
    onConfirm?: () => void | Promise<void>;
};
export declare function alert(p: DialogAlertProps): Promise<void>;
