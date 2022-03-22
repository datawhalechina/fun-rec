export interface Actions {
    setTrue: () => void;
    setFalse: () => void;
    set: (value: boolean) => void;
    toggle: () => void;
}
export default function useBoolean(defaultValue?: boolean): [boolean, Actions];
