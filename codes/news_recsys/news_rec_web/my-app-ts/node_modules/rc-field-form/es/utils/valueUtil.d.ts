import type { InternalNamePath, NamePath, Store, StoreValue, EventArgs } from '../interface';
/**
 * Convert name to internal supported format.
 * This function should keep since we still thinking if need support like `a.b.c` format.
 * 'a' => ['a']
 * 123 => [123]
 * ['a', 123] => ['a', 123]
 */
export declare function getNamePath(path: NamePath | null): InternalNamePath;
export declare function getValue(store: Store, namePath: InternalNamePath): any;
export declare function setValue(store: Store, namePath: InternalNamePath, value: StoreValue, removeIfUndefined?: boolean): Store;
export declare function cloneByNamePathList(store: Store, namePathList: InternalNamePath[]): Store;
export declare function containsNamePath(namePathList: InternalNamePath[], namePath: InternalNamePath): boolean;
export declare function setValues<T>(store: T, ...restValues: T[]): T;
export declare function matchNamePath(namePath: InternalNamePath, changedNamePath: InternalNamePath | null): boolean;
declare type SimilarObject = string | number | {};
export declare function isSimilar(source: SimilarObject, target: SimilarObject): boolean;
export declare function defaultGetValueFromEvent(valuePropName: string, ...args: EventArgs): any;
/**
 * Moves an array item from one position in an array to another.
 *
 * Note: This is a pure function so a new array will be returned, instead
 * of altering the array argument.
 *
 * @param array         Array in which to move an item.         (required)
 * @param moveIndex     The index of the item to move.          (required)
 * @param toIndex       The index to move item at moveIndex to. (required)
 */
export declare function move<T>(array: T[], moveIndex: number, toIndex: number): T[];
export {};
