"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useRefState = useRefState;

var _react = require("react");

function useRefState(initialState) {
  const [state, setState] = (0, _react.useState)(initialState);
  const ref = (0, _react.useRef)(state);
  (0, _react.useEffect)(() => {
    ref.current = state;
  }, [state]);
  return [state, setState, ref];
}