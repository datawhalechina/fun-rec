declare type CachedKey = string | number;
declare const getCachePromise: (cacheKey: CachedKey) => Promise<any> | undefined;
declare const setCachePromise: (cacheKey: CachedKey, promise: Promise<any>) => void;
export { getCachePromise, setCachePromise };
