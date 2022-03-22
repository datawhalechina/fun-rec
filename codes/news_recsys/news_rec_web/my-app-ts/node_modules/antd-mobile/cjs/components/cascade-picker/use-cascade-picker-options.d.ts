import { CascadePickerOption } from './cascade-picker';
export declare function useCascadePickerOptions(options: CascadePickerOption[]): {
    depth: number;
    subOptionsRecord: Record<string, CascadePickerOption[]>;
};
