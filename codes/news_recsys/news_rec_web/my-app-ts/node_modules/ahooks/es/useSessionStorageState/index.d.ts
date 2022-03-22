declare const useSessionStorageState: {
    <T = any>(key: string, options?: import("../createUseStorageState").Options<T> | undefined): import("../createUseStorageState").StorageStateResult<T>;
    <T_1>(key: string, options: import("../createUseStorageState").OptionsWithDefaultValue<T_1>): import("../createUseStorageState").StorageStateResultHasDefaultValue<T_1>;
};
export default useSessionStorageState;
