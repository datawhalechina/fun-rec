/// <reference types="react" />
import './action-sheet.less';
import { showActionSheet } from './action-sheet';
export type { Action, ActionSheetProps, ActionSheetShowHandler, } from './action-sheet';
declare const _default: import("react").FC<import("./action-sheet").ActionSheetProps> & {
    show: typeof showActionSheet;
};
export default _default;
