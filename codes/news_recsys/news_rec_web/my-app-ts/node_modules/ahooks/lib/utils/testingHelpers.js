"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.request = exports.sleep = void 0;

function sleep(time) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, time);
  });
}

exports.sleep = sleep;

function request(req) {
  return new Promise(function (resolve, reject) {
    return setTimeout(function () {
      if (req === 0) {
        reject(new Error('fail'));
      } else {
        resolve('success');
      }
    }, 1000);
  });
}

exports.request = request;