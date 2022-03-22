/// <reference types="react" />
export default function useSelections<T>(items: T[], defaultSelected?: T[]): {
    readonly selected: T[];
    readonly noneSelected: boolean;
    readonly allSelected: boolean;
    readonly partiallySelected: boolean;
    readonly setSelected: import("react").Dispatch<import("react").SetStateAction<T[]>>;
    readonly isSelected: (item: T) => boolean;
    readonly select: (this: unknown, item: T) => void;
    readonly unSelect: (this: unknown, item: T) => void;
    readonly toggle: (this: unknown, item: T) => void;
    readonly selectAll: (this: unknown) => void;
    readonly unSelectAll: (this: unknown) => void;
    readonly toggleAll: (this: unknown) => void;
};
