import { FC } from 'react';
import { CheckboxValue } from '.';
export interface CheckboxGroupProps {
    value?: CheckboxValue[];
    onChange?: (val: CheckboxValue[]) => void;
    defaultValue?: CheckboxValue[];
    disabled?: boolean;
}
export declare const Group: FC<CheckboxGroupProps>;
