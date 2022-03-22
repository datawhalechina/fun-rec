export interface IFuncUpdater<T> {
    (previousState?: T): T;
}
export interface IFuncStorage {
    (): Storage;
}
export interface Options<T> {
    serializer?: (value: T) => string;
    deserializer?: (value: string) => T;
}
export interface OptionsWithDefaultValue<T> extends Options<T> {
    defaultValue: T | IFuncUpdater<T>;
}
export declare type StorageStateResult<T> = [T | undefined, (value?: T | IFuncUpdater<T>) => void];
export declare type StorageStateResultHasDefaultValue<T> = [T, (value?: T | IFuncUpdater<T>) => void];
export declare function createUseStorageState(getStorage: () => Storage | undefined): {
    <T = any>(key: string, options?: Options<T> | undefined): StorageStateResult<T>;
    <T_1>(key: string, options: OptionsWithDefaultValue<T_1>): StorageStateResultHasDefaultValue<T_1>;
};
