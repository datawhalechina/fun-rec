"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useIsomorphicUpdateLayoutEffect = void 0;

var _ahooks = require("ahooks");

const useIsomorphicUpdateLayoutEffect = (0, _ahooks.createUpdateEffect)(_ahooks.useIsomorphicLayoutEffect);
exports.useIsomorphicUpdateLayoutEffect = useIsomorphicUpdateLayoutEffect;