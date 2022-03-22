import * as React from 'react';
import { FormInstance } from './interface';
import Field from './Field';
import List from './List';
import useForm from './useForm';
import { FormProps } from './Form';
import { FormProvider } from './FormContext';
import FieldContext from './FieldContext';
import ListContext from './ListContext';
declare const InternalForm: <Values = any>(props: FormProps<Values> & {
    children?: React.ReactNode;
} & {
    ref?: React.Ref<FormInstance<Values>>;
}) => React.ReactElement;
declare type InternalFormType = typeof InternalForm;
interface RefFormType extends InternalFormType {
    FormProvider: typeof FormProvider;
    Field: typeof Field;
    List: typeof List;
    useForm: typeof useForm;
}
declare const RefForm: RefFormType;
export { FormInstance, Field, List, useForm, FormProvider, FormProps, FieldContext, ListContext };
export default RefForm;
