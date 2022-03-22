"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var isBrowser_1 = __importDefault(require("./isBrowser"));

var useEffectWithTarget_1 = __importDefault(require("./useEffectWithTarget"));

var useLayoutEffectWithTarget_1 = __importDefault(require("./useLayoutEffectWithTarget"));

var useIsomorphicLayoutEffectWithTarget = isBrowser_1["default"] ? useLayoutEffectWithTarget_1["default"] : useEffectWithTarget_1["default"];
exports["default"] = useIsomorphicLayoutEffectWithTarget;