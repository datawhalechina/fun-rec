export default function useHistoryTravel<T>(initialValue?: T): {
    value: T | undefined;
    backLength: number;
    forwardLength: number;
    setValue: (this: unknown, val: T) => void;
    go: (this: unknown, step: number) => void;
    back: (this: unknown) => void;
    forward: (this: unknown) => void;
    reset: (this: unknown, ...args: any[]) => void;
};
