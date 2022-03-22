export declare function call<T>(v: T | ((...args: any[]) => T), ...args: any[]): T;
export declare function noop(): void;
export declare function chain(...fns: Function[]): Function;
export declare function assignDefault<T extends Object>(value: Partial<T> | undefined, fallback: T): T;
