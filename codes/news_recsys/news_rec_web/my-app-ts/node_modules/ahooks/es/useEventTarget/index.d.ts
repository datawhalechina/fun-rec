interface EventTarget<U> {
    target: {
        value: U;
    };
}
export interface Options<T, U> {
    initialValue?: T;
    transformer?: (value: U) => T;
}
declare function useEventTarget<T, U = T>(options?: Options<T, U>): readonly [T | undefined, {
    readonly onChange: (e: EventTarget<U>) => void;
    readonly reset: () => void;
}];
export default useEventTarget;
