import type { BasicTarget } from '../utils/domTarget';
export interface Options {
    onFocus?: (e: FocusEvent) => void;
    onBlur?: (e: FocusEvent) => void;
    onChange?: (isFocusWithin: boolean) => void;
}
export default function useFocusWithin(target: BasicTarget, options?: Options): boolean;
