"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var createUseStorageState_1 = require("../createUseStorageState");

var isBrowser_1 = __importDefault(require("../utils/isBrowser"));

var useLocalStorageState = createUseStorageState_1.createUseStorageState(function () {
  return isBrowser_1["default"] ? localStorage : undefined;
});
exports["default"] = useLocalStorageState;