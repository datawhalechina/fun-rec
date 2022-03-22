"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useInitialized = useInitialized;

var _react = require("react");

function useInitialized(check) {
  const initializedRef = (0, _react.useRef)(check);

  if (check) {
    initializedRef.current = true;
  }

  return !!initializedRef.current;
}