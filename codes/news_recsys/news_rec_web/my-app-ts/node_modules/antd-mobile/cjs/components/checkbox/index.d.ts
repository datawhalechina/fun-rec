/// <reference types="react" />
import './checkbox.less';
export type { CheckboxValue, CheckboxProps } from './checkbox';
export type { CheckboxGroupProps } from './group';
declare const _default: import("react").FC<import("./checkbox").CheckboxProps> & {
    Group: import("react").FC<import("./group").CheckboxGroupProps>;
};
export default _default;
