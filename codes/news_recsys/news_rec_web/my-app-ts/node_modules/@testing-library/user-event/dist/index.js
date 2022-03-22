"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
Object.defineProperty(exports, "specialChars", {
  enumerable: true,
  get: function () {
    return _keyboard.specialCharMap;
  }
});

var _click = require("./click");

var _type = require("./type");

var _clear = require("./clear");

var _tab = require("./tab");

var _hover = require("./hover");

var _upload = require("./upload");

var _selectOptions = require("./select-options");

var _paste = require("./paste");

var _keyboard = require("./keyboard");

const userEvent = {
  click: _click.click,
  dblClick: _click.dblClick,
  type: _type.type,
  clear: _clear.clear,
  tab: _tab.tab,
  hover: _hover.hover,
  unhover: _hover.unhover,
  upload: _upload.upload,
  selectOptions: _selectOptions.selectOptions,
  deselectOptions: _selectOptions.deselectOptions,
  paste: _paste.paste,
  keyboard: _keyboard.keyboard
};
var _default = userEvent;
exports.default = _default;