/// <reference types="react" />
import { CheckboxValue } from '.';
export declare const CheckboxGroupContext: import("react").Context<{
    value: CheckboxValue[];
    disabled: boolean;
    check: (val: CheckboxValue) => void;
    uncheck: (val: CheckboxValue) => void;
} | null>;
