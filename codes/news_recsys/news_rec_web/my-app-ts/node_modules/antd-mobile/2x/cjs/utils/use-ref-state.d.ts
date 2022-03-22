/// <reference types="react" />
export declare function useRefState<T>(initialState: T | (() => T)): readonly [T, import("react").Dispatch<import("react").SetStateAction<T>>, import("react").MutableRefObject<T>];
