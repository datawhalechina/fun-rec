"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.injectCSS = injectCSS;
exports.removeCSS = removeCSS;
exports.updateCSS = updateCSS;

var _canUseDom = _interopRequireDefault(require("./canUseDom"));

var MARK_KEY = "rc-util-key";

function getMark() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      mark = _ref.mark;

  if (mark) {
    return mark.startsWith('data-') ? mark : "data-".concat(mark);
  }

  return MARK_KEY;
}

function getContainer(option) {
  if (option.attachTo) {
    return option.attachTo;
  }

  var head = document.querySelector('head');
  return head || document.body;
}

function injectCSS(css) {
  var _option$csp;

  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!(0, _canUseDom.default)()) {
    return null;
  }

  var styleNode = document.createElement('style');

  if ((_option$csp = option.csp) === null || _option$csp === void 0 ? void 0 : _option$csp.nonce) {
    var _option$csp2;

    styleNode.nonce = (_option$csp2 = option.csp) === null || _option$csp2 === void 0 ? void 0 : _option$csp2.nonce;
  }

  styleNode.innerHTML = css;
  var container = getContainer(option);
  var firstChild = container.firstChild;

  if (option.prepend && container.prepend) {
    // Use `prepend` first
    container.prepend(styleNode);
  } else if (option.prepend && firstChild) {
    // Fallback to `insertBefore` like IE not support `prepend`
    container.insertBefore(styleNode, firstChild);
  } else {
    container.appendChild(styleNode);
  }

  return styleNode;
}

var containerCache = new Map();

function findExistNode(key) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var container = getContainer(option);
  return Array.from(containerCache.get(container).children).find(function (node) {
    return node.tagName === 'STYLE' && node.getAttribute(getMark(option)) === key;
  });
}

function removeCSS(key) {
  var _existNode$parentNode;

  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var existNode = findExistNode(key, option);
  existNode === null || existNode === void 0 ? void 0 : (_existNode$parentNode = existNode.parentNode) === null || _existNode$parentNode === void 0 ? void 0 : _existNode$parentNode.removeChild(existNode);
}

function updateCSS(css, key) {
  var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var container = getContainer(option); // Get real parent

  if (!containerCache.has(container)) {
    var placeholderStyle = injectCSS('', option);
    var parentNode = placeholderStyle.parentNode;
    containerCache.set(container, parentNode);
    parentNode.removeChild(placeholderStyle);
  }

  var existNode = findExistNode(key, option);

  if (existNode) {
    var _option$csp3, _option$csp4;

    if (((_option$csp3 = option.csp) === null || _option$csp3 === void 0 ? void 0 : _option$csp3.nonce) && existNode.nonce !== ((_option$csp4 = option.csp) === null || _option$csp4 === void 0 ? void 0 : _option$csp4.nonce)) {
      var _option$csp5;

      existNode.nonce = (_option$csp5 = option.csp) === null || _option$csp5 === void 0 ? void 0 : _option$csp5.nonce;
    }

    if (existNode.innerHTML !== css) {
      existNode.innerHTML = css;
    }

    return existNode;
  }

  var newNode = injectCSS(css, option);
  newNode.setAttribute(getMark(option), key);
  return newNode;
}