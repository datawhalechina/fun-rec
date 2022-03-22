/// <reference types="react" />
import './picker.less';
import { prompt } from './prompt';
export type { PickerProps } from './picker';
export type { PickerValue, PickerColumnItem, PickerColumn, PickerValueExtend, } from '../picker-view';
declare const _default: import("react").NamedExoticComponent<import("./picker").PickerProps> & {
    prompt: typeof prompt;
};
export default _default;
