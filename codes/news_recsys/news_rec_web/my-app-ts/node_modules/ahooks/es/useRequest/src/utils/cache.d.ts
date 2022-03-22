declare type Timer = ReturnType<typeof setTimeout>;
declare type CachedKey = string | number;
export interface CachedData<TData = any, TParams = any> {
    data: TData;
    params: TParams;
    time: number;
}
interface RecordData extends CachedData {
    timer: Timer | undefined;
}
declare const setCache: (key: CachedKey, cacheTime: number, cachedData: CachedData) => void;
declare const getCache: (key: CachedKey) => RecordData | undefined;
declare const clearCache: (key?: string | string[] | undefined) => void;
export { getCache, setCache, clearCache };
