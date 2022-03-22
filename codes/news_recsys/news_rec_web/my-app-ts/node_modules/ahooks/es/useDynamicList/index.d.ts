declare const useDynamicList: <T>(initialList?: T[]) => {
    list: T[];
    insert: (index: number, item: T) => void;
    merge: (index: number, items: T[]) => void;
    replace: (index: number, item: T) => void;
    remove: (index: number) => void;
    getKey: (index: number) => number;
    getIndex: (key: number) => number;
    move: (oldIndex: number, newIndex: number) => void;
    push: (item: T) => void;
    pop: () => void;
    unshift: (item: T) => void;
    shift: () => void;
    sortList: (result: T[]) => T[];
    resetList: (newList: T[]) => void;
};
export default useDynamicList;
