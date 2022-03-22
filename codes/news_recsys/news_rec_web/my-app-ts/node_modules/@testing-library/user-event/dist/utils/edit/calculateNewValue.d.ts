export declare function calculateNewValue(newEntry: string, element: HTMLElement, value?: string, selectionRange?: {
    selectionStart: number | null;
    selectionEnd: number | null;
}, deleteContent?: 'backward' | 'forward'): {
    newValue: string;
    newSelectionStart: number;
};
