"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hover = hover;
exports.unhover = unhover;

var _dom = require("@testing-library/dom");

var _utils = require("./utils");

// includes `element`
function getParentElements(element) {
  const parentElements = [element];
  let currentElement = element;

  while ((currentElement = currentElement.parentElement) != null) {
    parentElements.push(currentElement);
  }

  return parentElements;
}

function hover(element, init, {
  skipPointerEventsCheck = false
} = {}) {
  if (!skipPointerEventsCheck && !(0, _utils.hasPointerEvents)(element)) {
    throw new Error('unable to hover element as it has or inherits pointer-events set to "none".');
  }

  if ((0, _utils.isLabelWithInternallyDisabledControl)(element)) return;
  const parentElements = getParentElements(element).reverse();

  _dom.fireEvent.pointerOver(element, init);

  for (const el of parentElements) {
    _dom.fireEvent.pointerEnter(el, init);
  }

  if (!(0, _utils.isDisabled)(element)) {
    _dom.fireEvent.mouseOver(element, (0, _utils.getMouseEventOptions)('mouseover', init));

    for (const el of parentElements) {
      _dom.fireEvent.mouseEnter(el, (0, _utils.getMouseEventOptions)('mouseenter', init));
    }
  }

  _dom.fireEvent.pointerMove(element, init);

  if (!(0, _utils.isDisabled)(element)) {
    _dom.fireEvent.mouseMove(element, (0, _utils.getMouseEventOptions)('mousemove', init));
  }
}

function unhover(element, init, {
  skipPointerEventsCheck = false
} = {}) {
  if (!skipPointerEventsCheck && !(0, _utils.hasPointerEvents)(element)) {
    throw new Error('unable to unhover element as it has or inherits pointer-events set to "none".');
  }

  if ((0, _utils.isLabelWithInternallyDisabledControl)(element)) return;
  const parentElements = getParentElements(element);

  _dom.fireEvent.pointerMove(element, init);

  if (!(0, _utils.isDisabled)(element)) {
    _dom.fireEvent.mouseMove(element, (0, _utils.getMouseEventOptions)('mousemove', init));
  }

  _dom.fireEvent.pointerOut(element, init);

  for (const el of parentElements) {
    _dom.fireEvent.pointerLeave(el, init);
  }

  if (!(0, _utils.isDisabled)(element)) {
    _dom.fireEvent.mouseOut(element, (0, _utils.getMouseEventOptions)('mouseout', init));

    for (const el of parentElements) {
      _dom.fireEvent.mouseLeave(el, (0, _utils.getMouseEventOptions)('mouseleave', init));
    }
  }
}