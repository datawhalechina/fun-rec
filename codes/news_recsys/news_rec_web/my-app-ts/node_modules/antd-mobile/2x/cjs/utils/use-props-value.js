"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usePropsValue = usePropsValue;

var _react = require("react");

var _ahooks = require("ahooks");

function usePropsValue(options) {
  const {
    value,
    defaultValue,
    onChange
  } = options;
  const update = (0, _ahooks.useUpdate)();
  const stateRef = (0, _react.useRef)(value !== undefined ? value : defaultValue);

  if (value !== undefined) {
    stateRef.current = value;
  }

  const setState = (0, _ahooks.useMemoizedFn)(v => {
    const nextValue = typeof v === 'function' ? v(stateRef.current) : v;

    if (value === undefined) {
      stateRef.current = nextValue;
      update();
    }

    onChange === null || onChange === void 0 ? void 0 : onChange(nextValue);
  });
  return [stateRef.current, setState];
}