"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var depsAreSame_1 = __importDefault(require("../utils/depsAreSame"));

function useCreation(factory, deps) {
  var current = react_1.useRef({
    deps: deps,
    obj: undefined,
    initialized: false
  }).current;

  if (current.initialized === false || !depsAreSame_1["default"](current.deps, deps)) {
    current.deps = deps;
    current.obj = factory();
    current.initialized = true;
  }

  return current.obj;
}

exports["default"] = useCreation;