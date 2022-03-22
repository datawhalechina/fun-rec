"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ShouldRender = void 0;
exports.useShouldRender = useShouldRender;

var _useInitialized = require("./use-initialized");

const ShouldRender = props => {
  const shouldRender = useShouldRender(props.active, props.forceRender, props.destroyOnClose);
  return shouldRender ? props.children : null;
};

exports.ShouldRender = ShouldRender;

function useShouldRender(active, forceRender, destroyOnClose) {
  const initialized = (0, _useInitialized.useInitialized)(active);
  if (forceRender) return true;
  if (active) return true;
  if (!initialized) return false;
  return !destroyOnClose;
}