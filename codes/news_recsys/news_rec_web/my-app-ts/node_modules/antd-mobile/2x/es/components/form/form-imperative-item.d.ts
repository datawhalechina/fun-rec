import { FC, ReactNode } from 'react';
import { FormItemProps } from './form-item';
export declare const FormImperativeItem: FC<{
    renderValue: (value: any) => ReactNode;
} & Omit<FormItemProps, 'children'>>;
