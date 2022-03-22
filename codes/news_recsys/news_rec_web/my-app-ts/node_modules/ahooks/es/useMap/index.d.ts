declare function useMap<K, T>(initialValue?: Iterable<readonly [K, T]>): readonly [Map<K, T>, {
    readonly set: (this: unknown, key: K, entry: T) => void;
    readonly setAll: (this: unknown, newMap: Iterable<readonly [K, T]>) => void;
    readonly remove: (this: unknown, key: K) => void;
    readonly reset: (this: unknown) => void;
    readonly get: (this: unknown, key: K) => T | undefined;
}];
export default useMap;
