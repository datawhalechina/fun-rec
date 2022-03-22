"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var isEqual_1 = __importDefault(require("lodash/isEqual"));

var react_1 = require("react");

var useEffectWithTarget_1 = __importDefault(require("./useEffectWithTarget"));

var depsEqual = function depsEqual(aDeps, bDeps) {
  if (bDeps === void 0) {
    bDeps = [];
  }

  return isEqual_1["default"](aDeps, bDeps);
};

var useDeepCompareEffectWithTarget = function useDeepCompareEffectWithTarget(effect, deps, target) {
  var ref = react_1.useRef();
  var signalRef = react_1.useRef(0);

  if (!depsEqual(deps, ref.current)) {
    ref.current = deps;
    signalRef.current += 1;
  }

  useEffectWithTarget_1["default"](effect, [signalRef.current], target);
};

exports["default"] = useDeepCompareEffectWithTarget;