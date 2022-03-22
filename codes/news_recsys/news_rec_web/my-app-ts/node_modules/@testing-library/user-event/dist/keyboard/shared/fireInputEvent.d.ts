import { fireEvent } from '@testing-library/dom';
export declare function fireInputEvent(element: HTMLElement, { newValue, newSelectionStart, eventOverrides, }: {
    newValue: string;
    newSelectionStart: number;
    eventOverrides: Partial<Parameters<typeof fireEvent>[1]> & {
        [k: string]: unknown;
    };
}): void;
declare const initial: unique symbol;
declare const onBlur: unique symbol;
declare global {
    interface Element {
        [initial]?: string;
        [onBlur]?: EventListener;
    }
}
export {};
