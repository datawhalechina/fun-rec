declare function useSet<K>(initialValue?: Iterable<K>): readonly [Set<K>, {
    readonly add: (this: unknown, key: K) => void;
    readonly remove: (this: unknown, key: K) => void;
    readonly reset: (this: unknown) => void;
}];
export default useSet;
