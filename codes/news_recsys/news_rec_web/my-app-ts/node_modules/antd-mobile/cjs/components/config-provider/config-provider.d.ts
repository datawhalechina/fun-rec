import { FC } from 'react';
import { Locale } from '../../locales/base';
declare type Config = {
    locale: Locale;
};
export declare const defaultConfigRef: {
    current: Config;
};
export declare function setDefaultConfig(config: Config): void;
export declare function getDefaultConfig(): Config;
export declare type ConfigProviderProps = Config;
export declare const ConfigProvider: FC<ConfigProviderProps>;
export declare function useConfig(): Config;
export {};
