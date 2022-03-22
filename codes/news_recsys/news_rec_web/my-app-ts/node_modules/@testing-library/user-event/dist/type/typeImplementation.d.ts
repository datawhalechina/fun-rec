export interface typeOptions {
    delay?: number;
    skipClick?: boolean;
    skipAutoClose?: boolean;
    initialSelectionStart?: number;
    initialSelectionEnd?: number;
}
export declare function typeImplementation(element: Element, text: string, { delay, skipClick, skipAutoClose, initialSelectionStart, initialSelectionEnd, }: typeOptions & {
    delay: number;
}): Promise<void>;
