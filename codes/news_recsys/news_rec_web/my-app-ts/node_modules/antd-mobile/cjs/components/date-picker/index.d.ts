/// <reference types="react" />
import './date-picker.less';
import { prompt } from './prompt';
export type { DatePickerProps } from './date-picker';
export type { DatePickerFilter } from './date-picker-utils';
declare const _default: import("react").FC<import("./date-picker").DatePickerProps> & {
    prompt: typeof prompt;
};
export default _default;
