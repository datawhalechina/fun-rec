import React from 'react';
import type { FormInstance } from 'rc-field-form';
import type { NamePath } from 'rc-field-form/es/interface';
declare type RenderChildren<Values = any> = (changedValues: Record<string, any>, form: FormInstance<Values>) => React.ReactNode;
declare type ChildrenType<Values = any> = RenderChildren<Values>;
export interface FormSubscribeProps {
    to: NamePath[];
    children: ChildrenType;
}
export declare const FormSubscribe: React.VFC<FormSubscribeProps>;
export {};
