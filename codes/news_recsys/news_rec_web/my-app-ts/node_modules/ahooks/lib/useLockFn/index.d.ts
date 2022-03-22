declare function useLockFn<P extends any[] = any[], V extends any = any>(fn: (...args: P) => Promise<V>): (...args: P) => Promise<V | undefined>;
export default useLockFn;
