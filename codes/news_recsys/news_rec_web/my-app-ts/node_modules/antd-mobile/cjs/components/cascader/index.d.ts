/// <reference types="react" />
import { prompt } from './prompt';
import './cascader.less';
export type { CascaderProps } from './cascader';
export type { CascaderValue, CascaderValueExtend, CascaderOption, } from '../cascader-view';
declare const _default: import("react").FC<import("./cascader").CascaderProps> & {
    prompt: typeof prompt;
    optionSkeleton: import("../cascader-view").CascaderOption[];
};
export default _default;
