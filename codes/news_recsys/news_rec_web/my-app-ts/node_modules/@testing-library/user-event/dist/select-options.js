"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectOptions = exports.deselectOptions = void 0;

var _dom = require("@testing-library/dom");

var _utils = require("./utils");

var _click = require("./click");

var _focus = require("./focus");

var _hover = require("./hover");

function selectOptionsBase(newValue, select, values, init, {
  skipPointerEventsCheck = false
} = {}) {
  if (!newValue && !select.multiple) {
    throw (0, _dom.getConfig)().getElementError(`Unable to deselect an option in a non-multiple select. Use selectOptions to change the selection instead.`, select);
  }

  const valArray = Array.isArray(values) ? values : [values];
  const allOptions = Array.from(select.querySelectorAll('option, [role="option"]'));
  const selectedOptions = valArray.map(val => {
    if (typeof val !== 'string' && allOptions.includes(val)) {
      return val;
    } else {
      const matchingOption = allOptions.find(o => o.value === val || o.innerHTML === val);

      if (matchingOption) {
        return matchingOption;
      } else {
        throw (0, _dom.getConfig)().getElementError(`Value "${String(val)}" not found in options`, select);
      }
    }
  }).filter(option => !(0, _utils.isDisabled)(option));
  if ((0, _utils.isDisabled)(select) || !selectedOptions.length) return;

  if ((0, _utils.isElementType)(select, 'select')) {
    if (select.multiple) {
      for (const option of selectedOptions) {
        const withPointerEvents = skipPointerEventsCheck ? true : (0, _utils.hasPointerEvents)(option); // events fired for multiple select are weird. Can't use hover...

        if (withPointerEvents) {
          _dom.fireEvent.pointerOver(option, init);

          _dom.fireEvent.pointerEnter(select, init);

          _dom.fireEvent.mouseOver(option);

          _dom.fireEvent.mouseEnter(select);

          _dom.fireEvent.pointerMove(option, init);

          _dom.fireEvent.mouseMove(option, init);

          _dom.fireEvent.pointerDown(option, init);

          _dom.fireEvent.mouseDown(option, init);
        }

        (0, _focus.focus)(select);

        if (withPointerEvents) {
          _dom.fireEvent.pointerUp(option, init);

          _dom.fireEvent.mouseUp(option, init);
        }

        selectOption(option);

        if (withPointerEvents) {
          _dom.fireEvent.click(option, init);
        }
      }
    } else if (selectedOptions.length === 1) {
      const withPointerEvents = skipPointerEventsCheck ? true : (0, _utils.hasPointerEvents)(select); // the click to open the select options

      if (withPointerEvents) {
        (0, _click.click)(select, init, {
          skipPointerEventsCheck
        });
      } else {
        (0, _focus.focus)(select);
      }

      selectOption(selectedOptions[0]);

      if (withPointerEvents) {
        // the browser triggers another click event on the select for the click on the option
        // this second click has no 'down' phase
        _dom.fireEvent.pointerOver(select, init);

        _dom.fireEvent.pointerEnter(select, init);

        _dom.fireEvent.mouseOver(select);

        _dom.fireEvent.mouseEnter(select);

        _dom.fireEvent.pointerUp(select, init);

        _dom.fireEvent.mouseUp(select, init);

        _dom.fireEvent.click(select, init);
      }
    } else {
      throw (0, _dom.getConfig)().getElementError(`Cannot select multiple options on a non-multiple select`, select);
    }
  } else if (select.getAttribute('role') === 'listbox') {
    selectedOptions.forEach(option => {
      (0, _hover.hover)(option, init, {
        skipPointerEventsCheck
      });
      (0, _click.click)(option, init, {
        skipPointerEventsCheck
      });
      (0, _hover.unhover)(option, init, {
        skipPointerEventsCheck
      });
    });
  } else {
    throw (0, _dom.getConfig)().getElementError(`Cannot select options on elements that are neither select nor listbox elements`, select);
  }

  function selectOption(option) {
    option.selected = newValue;
    (0, _dom.fireEvent)(select, (0, _dom.createEvent)('input', select, {
      bubbles: true,
      cancelable: false,
      composed: true,
      ...init
    }));

    _dom.fireEvent.change(select, init);
  }
}

const selectOptions = selectOptionsBase.bind(null, true);
exports.selectOptions = selectOptions;
const deselectOptions = selectOptionsBase.bind(null, false);
exports.deselectOptions = deselectOptions;