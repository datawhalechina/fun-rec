export interface Options {
    min?: number;
    max?: number;
}
export interface Actions {
    inc: (delta?: number) => void;
    dec: (delta?: number) => void;
    set: (value: number | ((c: number) => number)) => void;
    reset: () => void;
}
export declare type ValueParam = number | ((c: number) => number);
declare function useCounter(initialValue?: number, options?: Options): readonly [number, {
    readonly inc: (this: unknown, delta?: number | undefined) => void;
    readonly dec: (this: unknown, delta?: number | undefined) => void;
    readonly set: (this: unknown, value: ValueParam) => void;
    readonly reset: (this: unknown) => void;
}];
export default useCounter;
