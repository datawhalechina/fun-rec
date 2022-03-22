"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wait = wait;

function wait(time) {
  return new Promise(resolve => setTimeout(() => resolve(), time));
}