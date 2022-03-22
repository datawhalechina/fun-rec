"use strict";

require("./global.css");

var _canUseDom = require("../utils/can-use-dom");

if (_canUseDom.canUseDom) {
  document.addEventListener('touchstart', () => {}, true);
}