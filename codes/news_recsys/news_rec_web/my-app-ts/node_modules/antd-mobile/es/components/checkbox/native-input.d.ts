import { FC } from 'react';
interface Props {
    type: 'checkbox' | 'radio';
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    id?: string;
}
export declare const NativeInput: FC<Props>;
export {};
