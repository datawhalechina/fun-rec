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

var depsEqual = function depsEqual(aDeps, bDeps) {
  if (bDeps === void 0) {
    bDeps = [];
  }

  return isEqual_1["default"](aDeps, bDeps);
};

var useDeepCompareEffect = function useDeepCompareEffect(effect, deps) {
  var ref = react_1.useRef();
  var signalRef = react_1.useRef(0);

  if (!depsEqual(deps, ref.current)) {
    ref.current = deps;
    signalRef.current += 1;
  }

  react_1.useEffect(effect, [signalRef.current]);
};

exports["default"] = useDeepCompareEffect;