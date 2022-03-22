export interface Actions<T> {
    setLeft: () => void;
    setRight: () => void;
    set: (value: T) => void;
    toggle: () => void;
}
declare function useToggle<T = boolean>(): [boolean, Actions<T>];
declare function useToggle<T>(defaultValue: T): [T, Actions<T>];
declare function useToggle<T, U>(defaultValue: T, reverseValue: U): [T | U, Actions<T | U>];
export default useToggle;
