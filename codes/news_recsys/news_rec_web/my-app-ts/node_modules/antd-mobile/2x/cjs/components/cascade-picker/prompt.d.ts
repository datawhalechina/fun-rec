import { CascadePickerProps } from './cascade-picker';
import type { PickerValue } from '../picker';
export declare function prompt(props: Omit<CascadePickerProps, 'value' | 'visible' | 'children'>): Promise<PickerValue[] | null>;
