import { __rest } from "tslib";
import React, { useContext } from 'react';
import zhCN from '../../locales/zh-CN';
export const defaultConfigRef = {
  current: {
    locale: zhCN
  }
};
export function setDefaultConfig(config) {
  defaultConfigRef.current = config;
}
export function getDefaultConfig() {
  return defaultConfigRef.current;
}
const ConfigContext = React.createContext(null);
export const ConfigProvider = props => {
  const {
    children
  } = props,
        config = __rest(props, ["children"]);

  const parentConfig = useConfig();
  return React.createElement(ConfigContext.Provider, {
    value: Object.assign(Object.assign({}, parentConfig), config)
  }, children);
};
export function useConfig() {
  var _a;

  return (_a = useContext(ConfigContext)) !== null && _a !== void 0 ? _a : getDefaultConfig();
}