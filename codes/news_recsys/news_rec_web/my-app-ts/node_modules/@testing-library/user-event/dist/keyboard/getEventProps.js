"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKeyEventProps = getKeyEventProps;
exports.getMouseEventProps = getMouseEventProps;

function getKeyEventProps(keyDef, state) {
  var _keyDef$keyCode, _keyDef$key;

  return {
    key: keyDef.key,
    code: keyDef.code,
    altKey: state.modifiers.alt,
    ctrlKey: state.modifiers.ctrl,
    metaKey: state.modifiers.meta,
    shiftKey: state.modifiers.shift,

    /** @deprecated use code instead */
    keyCode: (_keyDef$keyCode = keyDef.keyCode) != null ? _keyDef$keyCode : // istanbul ignore next
    ((_keyDef$key = keyDef.key) == null ? void 0 : _keyDef$key.length) === 1 ? keyDef.key.charCodeAt(0) : undefined
  };
}

function getMouseEventProps(state) {
  return {
    altKey: state.modifiers.alt,
    ctrlKey: state.modifiers.ctrl,
    metaKey: state.modifiers.meta,
    shiftKey: state.modifiers.shift
  };
}