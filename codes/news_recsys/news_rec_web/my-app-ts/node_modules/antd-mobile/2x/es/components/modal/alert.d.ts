import { ModalProps } from './index';
import { ReactNode } from 'react';
export declare type ModalAlertProps = Omit<ModalProps, 'visible' | 'closeOnAction' | 'actions'> & {
    confirmText?: ReactNode;
    onConfirm?: () => void | Promise<void>;
};
export declare function alert(p: ModalAlertProps): Promise<void>;
