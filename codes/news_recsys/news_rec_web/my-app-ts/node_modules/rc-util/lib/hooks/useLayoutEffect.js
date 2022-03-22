"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _canUseDom = _interopRequireDefault(require("../Dom/canUseDom"));

/**
 * Wrap `React.useLayoutEffect` which will not throw warning message in test env
 */
var useLayoutEffect = process.env.NODE_ENV !== 'test' && (0, _canUseDom.default)() ? React.useLayoutEffect : React.useEffect;
var _default = useLayoutEffect;
exports.default = _default;