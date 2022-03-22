import type { ReactElement } from 'react';
import type { ReducerAction } from './useForm';
export declare type InternalNamePath = (string | number)[];
export declare type NamePath = string | number | InternalNamePath;
export declare type StoreValue = any;
export declare type Store = Record<string, StoreValue>;
export interface Meta {
    touched: boolean;
    validating: boolean;
    errors: string[];
    warnings: string[];
    name: InternalNamePath;
}
export interface InternalFieldData extends Meta {
    value: StoreValue;
}
/**
 * Used by `setFields` config
 */
export interface FieldData extends Partial<Omit<InternalFieldData, 'name'>> {
    name: NamePath;
}
export declare type RuleType = 'string' | 'number' | 'boolean' | 'method' | 'regexp' | 'integer' | 'float' | 'object' | 'enum' | 'date' | 'url' | 'hex' | 'email';
declare type Validator = (rule: RuleObject, value: StoreValue, callback: (error?: string) => void) => Promise<void | any> | void;
export declare type RuleRender = (form: FormInstance) => RuleObject;
export interface ValidatorRule {
    warningOnly?: boolean;
    message?: string | ReactElement;
    validator: Validator;
}
interface BaseRule {
    warningOnly?: boolean;
    enum?: StoreValue[];
    len?: number;
    max?: number;
    message?: string | ReactElement;
    min?: number;
    pattern?: RegExp;
    required?: boolean;
    transform?: (value: StoreValue) => StoreValue;
    type?: RuleType;
    whitespace?: boolean;
    /** Customize rule level `validateTrigger`. Must be subset of Field `validateTrigger` */
    validateTrigger?: string | string[];
}
declare type AggregationRule = BaseRule & Partial<ValidatorRule>;
interface ArrayRule extends Omit<AggregationRule, 'type'> {
    type: 'array';
    defaultField?: RuleObject;
}
export declare type RuleObject = AggregationRule | ArrayRule;
export declare type Rule = RuleObject | RuleRender;
export interface ValidateErrorEntity<Values = any> {
    values: Values;
    errorFields: {
        name: InternalNamePath;
        errors: string[];
    }[];
    outOfDate: boolean;
}
export interface FieldEntity {
    onStoreChange: (store: Store, namePathList: InternalNamePath[] | null, info: ValuedNotifyInfo) => void;
    isFieldTouched: () => boolean;
    isFieldDirty: () => boolean;
    isFieldValidating: () => boolean;
    isListField: () => boolean;
    isList: () => boolean;
    isPreserve: () => boolean;
    validateRules: (options?: ValidateOptions) => Promise<RuleError[]>;
    getMeta: () => Meta;
    getNamePath: () => InternalNamePath;
    getErrors: () => string[];
    getWarnings: () => string[];
    props: {
        name?: NamePath;
        rules?: Rule[];
        dependencies?: NamePath[];
        initialValue?: any;
    };
}
export interface FieldError {
    name: InternalNamePath;
    errors: string[];
    warnings: string[];
}
export interface RuleError {
    errors: string[];
    rule: RuleObject;
}
export interface ValidateOptions {
    triggerName?: string;
    validateMessages?: ValidateMessages;
    /**
     * Recursive validate. It will validate all the name path that contains the provided one.
     * e.g. ['a'] will validate ['a'] , ['a', 'b'] and ['a', 1].
     */
    recursive?: boolean;
}
export declare type InternalValidateFields<Values = any> = (nameList?: NamePath[], options?: ValidateOptions) => Promise<Values>;
export declare type ValidateFields<Values = any> = (nameList?: NamePath[]) => Promise<Values>;
interface ValueUpdateInfo {
    type: 'valueUpdate';
    source: 'internal' | 'external';
}
interface ValidateFinishInfo {
    type: 'validateFinish';
}
interface ResetInfo {
    type: 'reset';
}
interface RemoveInfo {
    type: 'remove';
}
interface SetFieldInfo {
    type: 'setField';
    data: FieldData;
}
interface DependenciesUpdateInfo {
    type: 'dependenciesUpdate';
    /**
     * Contains all the related `InternalNamePath[]`.
     * a <- b <- c : change `a`
     * relatedFields=[a, b, c]
     */
    relatedFields: InternalNamePath[];
}
export declare type NotifyInfo = ValueUpdateInfo | ValidateFinishInfo | ResetInfo | RemoveInfo | SetFieldInfo | DependenciesUpdateInfo;
export declare type ValuedNotifyInfo = NotifyInfo & {
    store: Store;
};
export interface Callbacks<Values = any> {
    onValuesChange?: (changedValues: any, values: Values) => void;
    onFieldsChange?: (changedFields: FieldData[], allFields: FieldData[]) => void;
    onFinish?: (values: Values) => void;
    onFinishFailed?: (errorInfo: ValidateErrorEntity<Values>) => void;
}
export interface InternalHooks {
    dispatch: (action: ReducerAction) => void;
    initEntityValue: (entity: FieldEntity) => void;
    registerField: (entity: FieldEntity) => () => void;
    useSubscribe: (subscribable: boolean) => void;
    setInitialValues: (values: Store, init: boolean) => void;
    setCallbacks: (callbacks: Callbacks) => void;
    getFields: (namePathList?: InternalNamePath[]) => FieldData[];
    setValidateMessages: (validateMessages: ValidateMessages) => void;
    setPreserve: (preserve?: boolean) => void;
    getInitialValue: (namePath: InternalNamePath) => StoreValue;
}
/** Only return partial when type is not any */
declare type RecursivePartial<T> = T extends object ? {
    [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : T[P] extends object ? RecursivePartial<T[P]> : T[P];
} : any;
export interface FormInstance<Values = any> {
    getFieldValue: (name: NamePath) => StoreValue;
    getFieldsValue: (() => Values) & ((nameList: NamePath[] | true, filterFunc?: (meta: Meta) => boolean) => any);
    getFieldError: (name: NamePath) => string[];
    getFieldsError: (nameList?: NamePath[]) => FieldError[];
    getFieldWarning: (name: NamePath) => string[];
    isFieldsTouched: ((nameList?: NamePath[], allFieldsTouched?: boolean) => boolean) & ((allFieldsTouched?: boolean) => boolean);
    isFieldTouched: (name: NamePath) => boolean;
    isFieldValidating: (name: NamePath) => boolean;
    isFieldsValidating: (nameList: NamePath[]) => boolean;
    resetFields: (fields?: NamePath[]) => void;
    setFields: (fields: FieldData[]) => void;
    setFieldsValue: (values: RecursivePartial<Values>) => void;
    validateFields: ValidateFields<Values>;
    submit: () => void;
}
export declare type InternalFormInstance = Omit<FormInstance, 'validateFields'> & {
    validateFields: InternalValidateFields;
    /**
     * Passed by field context props
     */
    prefixName?: InternalNamePath;
    validateTrigger?: string | string[] | false;
    /**
     * Form component should register some content into store.
     * We pass the `HOOK_MARK` as key to avoid user call the function.
     */
    getInternalHooks: (secret: string) => InternalHooks | null;
};
export declare type EventArgs = any[];
declare type ValidateMessage = string | (() => string);
export interface ValidateMessages {
    default?: ValidateMessage;
    required?: ValidateMessage;
    enum?: ValidateMessage;
    whitespace?: ValidateMessage;
    date?: {
        format?: ValidateMessage;
        parse?: ValidateMessage;
        invalid?: ValidateMessage;
    };
    types?: {
        string?: ValidateMessage;
        method?: ValidateMessage;
        array?: ValidateMessage;
        object?: ValidateMessage;
        number?: ValidateMessage;
        date?: ValidateMessage;
        boolean?: ValidateMessage;
        integer?: ValidateMessage;
        float?: ValidateMessage;
        regexp?: ValidateMessage;
        email?: ValidateMessage;
        url?: ValidateMessage;
        hex?: ValidateMessage;
    };
    string?: {
        len?: ValidateMessage;
        min?: ValidateMessage;
        max?: ValidateMessage;
        range?: ValidateMessage;
    };
    number?: {
        len?: ValidateMessage;
        min?: ValidateMessage;
        max?: ValidateMessage;
        range?: ValidateMessage;
    };
    array?: {
        len?: ValidateMessage;
        min?: ValidateMessage;
        max?: ValidateMessage;
        range?: ValidateMessage;
    };
    pattern?: {
        mismatch?: ValidateMessage;
    };
}
export {};
