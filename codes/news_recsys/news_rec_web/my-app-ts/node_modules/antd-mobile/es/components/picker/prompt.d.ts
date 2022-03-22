import type { PickerProps, PickerValue } from './index';
export declare function prompt(props: Omit<PickerProps, 'value' | 'visible' | 'children'>): Promise<PickerValue[] | null>;
