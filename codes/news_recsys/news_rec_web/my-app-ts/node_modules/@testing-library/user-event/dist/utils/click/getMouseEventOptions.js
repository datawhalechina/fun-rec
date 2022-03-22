"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMouseEventOptions = getMouseEventOptions;

function isMousePressEvent(event) {
  return event === 'mousedown' || event === 'mouseup' || event === 'click' || event === 'dblclick';
} // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons


const BUTTONS_NAMES = {
  none: 0,
  primary: 1,
  secondary: 2,
  auxiliary: 4
}; // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button

const BUTTON_NAMES = {
  primary: 0,
  auxiliary: 1,
  secondary: 2
};

function translateButtonNumber(value, from) {
  var _Object$entries$find;

  const [mapIn, mapOut] = from === 'button' ? [BUTTON_NAMES, BUTTONS_NAMES] : [BUTTONS_NAMES, BUTTON_NAMES];
  const name = (_Object$entries$find = Object.entries(mapIn).find(([, i]) => i === value)) == null ? void 0 : _Object$entries$find[0]; // istanbul ignore next

  return name && Object.prototype.hasOwnProperty.call(mapOut, name) ? mapOut[name] : 0;
}

function convertMouseButtons(event, init, property) {
  if (!isMousePressEvent(event)) {
    return 0;
  }

  if (typeof init[property] === 'number') {
    return init[property];
  } else if (property === 'button' && typeof init.buttons === 'number') {
    return translateButtonNumber(init.buttons, 'buttons');
  } else if (property === 'buttons' && typeof init.button === 'number') {
    return translateButtonNumber(init.button, 'button');
  }

  return property != 'button' && isMousePressEvent(event) ? 1 : 0;
}

function getMouseEventOptions(event, init, clickCount = 0) {
  var _init;

  init = (_init = init) != null ? _init : {};
  return { ...init,
    // https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail
    detail: event === 'mousedown' || event === 'mouseup' || event === 'click' ? 1 + clickCount : clickCount,
    buttons: convertMouseButtons(event, init, 'buttons'),
    button: convertMouseButtons(event, init, 'button')
  };
}