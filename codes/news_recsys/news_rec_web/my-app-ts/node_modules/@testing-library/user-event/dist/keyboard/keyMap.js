"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultKeyMap = void 0;

var _types = require("./types");

/**
 * Mapping for a default US-104-QWERTY keyboard
 */
const defaultKeyMap = [// alphanumeric keys
...'0123456789'.split('').map(c => ({
  code: `Digit${c}`,
  key: c
})), ...')!@#$%^&*('.split('').map((c, i) => ({
  code: `Digit${i}`,
  key: c,
  shiftKey: true
})), ...'abcdefghijklmnopqrstuvwxyz'.split('').map(c => ({
  code: `Key${c.toUpperCase()}`,
  key: c
})), ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(c => ({
  code: `Key${c}`,
  key: c,
  shiftKey: true
})), // alphanumeric block - functional
{
  code: 'Space',
  key: ' '
}, {
  code: 'AltLeft',
  key: 'Alt',
  location: _types.DOM_KEY_LOCATION.LEFT,
  keyCode: 18
}, {
  code: 'AltRight',
  key: 'Alt',
  location: _types.DOM_KEY_LOCATION.RIGHT,
  keyCode: 18
}, {
  code: 'ShiftLeft',
  key: 'Shift',
  location: _types.DOM_KEY_LOCATION.LEFT,
  keyCode: 16
}, {
  code: 'ShiftRight',
  key: 'Shift',
  location: _types.DOM_KEY_LOCATION.RIGHT,
  keyCode: 16
}, {
  code: 'ControlLeft',
  key: 'Control',
  location: _types.DOM_KEY_LOCATION.LEFT,
  keyCode: 17
}, {
  code: 'ControlRight',
  key: 'Control',
  location: _types.DOM_KEY_LOCATION.RIGHT,
  keyCode: 17
}, {
  code: 'MetaLeft',
  key: 'Meta',
  location: _types.DOM_KEY_LOCATION.LEFT,
  keyCode: 93
}, {
  code: 'MetaRight',
  key: 'Meta',
  location: _types.DOM_KEY_LOCATION.RIGHT,
  keyCode: 93
}, {
  code: 'OSLeft',
  key: 'OS',
  location: _types.DOM_KEY_LOCATION.LEFT,
  keyCode: 91
}, {
  code: 'OSRight',
  key: 'OS',
  location: _types.DOM_KEY_LOCATION.RIGHT,
  keyCode: 91
}, {
  code: 'CapsLock',
  key: 'CapsLock',
  keyCode: 20
}, {
  code: 'Backspace',
  key: 'Backspace',
  keyCode: 8
}, {
  code: 'Enter',
  key: 'Enter',
  keyCode: 13
}, // function
{
  code: 'Escape',
  key: 'Escape',
  keyCode: 27
}, // arrows
{
  code: 'ArrowUp',
  key: 'ArrowUp',
  keyCode: 38
}, {
  code: 'ArrowDown',
  key: 'ArrowDown',
  keyCode: 40
}, {
  code: 'ArrowLeft',
  key: 'ArrowLeft',
  keyCode: 37
}, {
  code: 'ArrowRight',
  key: 'ArrowRight',
  keyCode: 39
}, // control pad
{
  code: 'Home',
  key: 'Home',
  keyCode: 36
}, {
  code: 'End',
  key: 'End',
  keyCode: 35
}, {
  code: 'Delete',
  key: 'Delete',
  keyCode: 46
}, {
  code: 'PageUp',
  key: 'PageUp',
  keyCode: 33
}, {
  code: 'PageDown',
  key: 'PageDown',
  keyCode: 34
} // TODO: add mappings
];
exports.defaultKeyMap = defaultKeyMap;