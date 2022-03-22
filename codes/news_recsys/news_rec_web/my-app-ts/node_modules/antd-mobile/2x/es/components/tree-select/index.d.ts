/// <reference types="react" />
import './tree-select.less';
export type { TreeSelectProps, TreeSelectOption } from './tree-select';
export type { MultipleProps } from './multiple';
declare const _default: import("react").FC<import("./tree-select").TreeSelectProps> & {
    Multiple: import("react").FC<import("./multiple").MultipleProps>;
};
export default _default;
