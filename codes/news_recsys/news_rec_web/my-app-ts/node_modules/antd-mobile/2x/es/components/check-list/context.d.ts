import { ReactNode } from 'react';
export declare const CheckListContext: import("react").Context<{
    value: string[];
    check: (val: string) => void;
    uncheck: (val: string) => void;
    activeIcon?: ReactNode;
    disabled?: boolean | undefined;
    readOnly?: boolean | undefined;
} | null>;
