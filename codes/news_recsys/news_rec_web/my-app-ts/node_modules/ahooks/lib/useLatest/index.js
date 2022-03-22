"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

function useLatest(value) {
  var ref = react_1.useRef(value);
  ref.current = value;
  return ref;
}

exports["default"] = useLatest;