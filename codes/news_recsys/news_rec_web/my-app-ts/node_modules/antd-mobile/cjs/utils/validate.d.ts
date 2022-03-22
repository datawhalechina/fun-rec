export declare function isDef<T>(val: T): val is NonNullable<T>;
export declare function isObject(val: unknown): val is Record<any, any>;
export declare function isPromise(obj: unknown): obj is Promise<unknown>;
export declare function isDate(val: unknown): val is Date;
export declare function isMobile(value: string): boolean;
export declare function isNumeric(val: string | number): val is string;
export declare function isAndroid(): boolean;
export declare function isIOS(): boolean;
