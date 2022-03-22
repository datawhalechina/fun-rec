declare enum selectionSupportType {
    'text' = "text",
    'search' = "search",
    'url' = "url",
    'tel' = "tel",
    'password' = "password"
}
export declare function hasSelectionSupport(element: Element): element is HTMLTextAreaElement | (HTMLInputElement & {
    type: selectionSupportType;
});
export declare function getSelectionRange(element: Element): {
    selectionStart: number | null;
    selectionEnd: number | null;
};
export declare function setSelectionRange(element: Element, newSelectionStart: number, newSelectionEnd: number): void;
export {};
