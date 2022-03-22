"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTargetElement = void 0;

var isBrowser_1 = __importDefault(require("./isBrowser"));

function getTargetElement(target, defaultElement) {
  if (!isBrowser_1["default"]) {
    return undefined;
  }

  if (!target) {
    return defaultElement;
  }

  var targetElement;

  if (typeof target === 'function') {
    targetElement = target();
  } else if ('current' in target) {
    targetElement = target.current;
  } else {
    targetElement = target;
  }

  return targetElement;
}

exports.getTargetElement = getTargetElement;