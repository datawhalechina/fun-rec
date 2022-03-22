import { PickerColumn } from '../picker-view';
import { CascadePickerOption } from './cascade-picker';
export declare function generateCascadePickerColumns(value: string[], options: CascadePickerOption[], depth: number, subOptionsRecord: Record<string, CascadePickerOption[]>): PickerColumn[];
