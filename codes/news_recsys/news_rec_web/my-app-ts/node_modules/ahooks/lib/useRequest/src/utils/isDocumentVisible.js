"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var canUseDom_1 = __importDefault(require("../../../utils/canUseDom"));

function isDocumentVisible() {
  if (canUseDom_1["default"]()) {
    return document.visibilityState !== 'hidden';
  }

  return true;
}

exports["default"] = isDocumentVisible;