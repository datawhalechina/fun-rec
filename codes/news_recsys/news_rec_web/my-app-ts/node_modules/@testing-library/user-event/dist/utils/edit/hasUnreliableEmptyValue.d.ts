declare enum unreliableValueInputTypes {
    'number' = "number"
}
/**
 * Check if an empty IDL value on the element could mean a derivation of displayed value and IDL value
 */
export declare function hasUnreliableEmptyValue(element: Element): element is HTMLInputElement & {
    type: unreliableValueInputTypes;
};
export {};
