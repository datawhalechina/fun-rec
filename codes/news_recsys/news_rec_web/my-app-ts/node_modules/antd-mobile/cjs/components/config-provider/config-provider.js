"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultConfigRef = exports.ConfigProvider = void 0;
exports.getDefaultConfig = getDefaultConfig;
exports.setDefaultConfig = setDefaultConfig;
exports.useConfig = useConfig;

var _tslib = require("tslib");

var _react = _interopRequireWildcard(require("react"));

var _zhCN = _interopRequireDefault(require("../../locales/zh-CN"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const defaultConfigRef = {
  current: {
    locale: _zhCN.default
  }
};
exports.defaultConfigRef = defaultConfigRef;

function setDefaultConfig(config) {
  defaultConfigRef.current = config;
}

function getDefaultConfig() {
  return defaultConfigRef.current;
}

const ConfigContext = _react.default.createContext(null);

const ConfigProvider = props => {
  const {
    children
  } = props,
        config = (0, _tslib.__rest)(props, ["children"]);
  const parentConfig = useConfig();
  return _react.default.createElement(ConfigContext.Provider, {
    value: Object.assign(Object.assign({}, parentConfig), config)
  }, children);
};

exports.ConfigProvider = ConfigProvider;

function useConfig() {
  var _a;

  return (_a = (0, _react.useContext)(ConfigContext)) !== null && _a !== void 0 ? _a : getDefaultConfig();
}