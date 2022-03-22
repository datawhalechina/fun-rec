declare type noop = (this: any, ...args: any[]) => any;
declare type PickFunction<T extends noop> = (this: ThisParameterType<T>, ...args: Parameters<T>) => ReturnType<T>;
declare function useMemoizedFn<T extends noop>(fn: T): PickFunction<T>;
export default useMemoizedFn;
