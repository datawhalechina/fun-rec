"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useMutationEffect = useMutationEffect;

var _react = require("react");

var _ahooks = require("ahooks");

function useMutationEffect(effect, targetRef, options) {
  const fn = (0, _ahooks.useMemoizedFn)(effect);
  (0, _react.useEffect)(() => {
    const observer = new MutationObserver(() => {
      fn();
    });
    if (!targetRef.current) return;
    observer.observe(targetRef.current, options);
    return () => {
      observer.disconnect();
    };
  }, [targetRef]);
}