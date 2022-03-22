import { ToastProps } from './toast';
export declare type ToastShowProps = Omit<ToastProps, 'visible'>;
export declare type ToastHandler = {
    close: () => void;
};
export declare function show(p: ToastShowProps | string): ToastHandler;
export declare function clear(): void;
export declare function config(val: Pick<ToastProps, 'duration' | 'position' | 'maskClickable'>): void;
