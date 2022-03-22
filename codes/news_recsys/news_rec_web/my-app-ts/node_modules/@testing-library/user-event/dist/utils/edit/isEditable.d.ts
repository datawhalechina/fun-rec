import { isContentEditable } from './isContentEditable';
declare type GuardedType<T> = T extends (x: any) => x is infer R ? R : never;
export declare function isEditable(element: Element): element is GuardedType<typeof isContentEditable> | GuardedType<typeof isEditableInput> | (HTMLTextAreaElement & {
    readOnly: false;
});
export declare enum editableInputTypes {
    'text' = "text",
    'date' = "date",
    'datetime-local' = "datetime-local",
    'email' = "email",
    'month' = "month",
    'number' = "number",
    'password' = "password",
    'search' = "search",
    'tel' = "tel",
    'time' = "time",
    'url' = "url",
    'week' = "week"
}
export declare function isEditableInput(element: Element): element is HTMLInputElement & {
    readOnly: false;
    type: editableInputTypes;
};
export {};
