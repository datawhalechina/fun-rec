/// <reference types="react" />
import './dialog.less';
import { show } from './show';
import { alert } from './alert';
import { confirm } from './confirm';
import { clear } from './clear';
export type { DialogProps } from './dialog';
export type { Action } from './dialog-action-button';
export type { DialogShowProps, DialogShowHandler } from './show';
export type { DialogAlertProps } from './alert';
export type { DialogConfirmProps } from './confirm';
declare const _default: import("react").FC<import("./dialog").DialogProps> & {
    show: typeof show;
    alert: typeof alert;
    confirm: typeof confirm;
    clear: typeof clear;
};
export default _default;
