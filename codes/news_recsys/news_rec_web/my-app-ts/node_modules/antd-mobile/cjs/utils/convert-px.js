"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertPx = convertPx;

var _canUseDom = require("./can-use-dom");

var _isDev = require("./is-dev");

var _devLog = require("./dev-log");

let tenPxTester = null;
let tester = null;

if (_canUseDom.canUseDom) {
  tenPxTester = document.createElement('div');
  tenPxTester.className = 'adm-px-tester';
  tenPxTester.style.setProperty('--size', '10');
  document.body.appendChild(tenPxTester);
  tester = document.createElement('div');
  tester.className = 'adm-px-tester';
  document.body.appendChild(tester);

  if (_isDev.isDev) {
    if (window.getComputedStyle(tester).position !== 'fixed') {
      (0, _devLog.devError)('Global', 'The px tester is not rendering properly. Please make sure you have imported `antd-mobile/es/global`.');
    }
  }
}

function convertPx(px) {
  if (tenPxTester === null || tester === null) return px;

  if (tenPxTester.getBoundingClientRect().height === 10) {
    return px;
  }

  tester.style.setProperty('--size', px.toString());
  return tester.getBoundingClientRect().height;
}