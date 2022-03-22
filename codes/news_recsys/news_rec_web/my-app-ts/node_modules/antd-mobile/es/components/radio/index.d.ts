/// <reference types="react" />
import './radio.less';
export type { RadioProps, RadioValue } from './radio';
export type { RadioGroupProps } from './group';
declare const _default: import("react").FC<import("./radio").RadioProps> & {
    Group: import("react").FC<import("./group").RadioGroupProps>;
};
export default _default;
