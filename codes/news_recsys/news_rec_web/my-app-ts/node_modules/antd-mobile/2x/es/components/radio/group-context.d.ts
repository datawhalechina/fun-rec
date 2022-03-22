/// <reference types="react" />
import { RadioValue } from '.';
export declare const RadioGroupContext: import("react").Context<{
    value: RadioValue[];
    disabled: boolean;
    check: (val: RadioValue) => void;
    uncheck: (val: RadioValue) => void;
} | null>;
