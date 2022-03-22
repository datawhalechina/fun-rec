interface pasteOptions {
    initialSelectionStart?: number;
    initialSelectionEnd?: number;
}
declare function paste(element: HTMLElement, text: string, init?: ClipboardEventInit, { initialSelectionStart, initialSelectionEnd }?: pasteOptions): void;
export { paste };
