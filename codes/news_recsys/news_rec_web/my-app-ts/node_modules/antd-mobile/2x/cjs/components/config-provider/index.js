"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
Object.defineProperty(exports, "getDefaultConfig", {
  enumerable: true,
  get: function () {
    return _configProvider.getDefaultConfig;
  }
});
Object.defineProperty(exports, "setDefaultConfig", {
  enumerable: true,
  get: function () {
    return _configProvider.setDefaultConfig;
  }
});
Object.defineProperty(exports, "useConfig", {
  enumerable: true,
  get: function () {
    return _configProvider.useConfig;
  }
});

var _configProvider = require("./config-provider");

var _default = _configProvider.ConfigProvider;
exports.default = _default;