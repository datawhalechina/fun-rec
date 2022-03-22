"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearCache = void 0;

var useRequest_1 = __importDefault(require("./src/useRequest"));

var cache_1 = require("./src/utils/cache");

Object.defineProperty(exports, "clearCache", {
  enumerable: true,
  get: function get() {
    return cache_1.clearCache;
  }
});
exports["default"] = useRequest_1["default"];