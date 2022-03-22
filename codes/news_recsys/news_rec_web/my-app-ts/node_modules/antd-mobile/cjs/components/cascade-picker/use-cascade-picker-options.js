"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useCascadePickerOptions = useCascadePickerOptions;

var _react = require("react");

function useCascadePickerOptions(options) {
  return (0, _react.useMemo)(() => {
    let depth = 1;
    const subOptionsRecord = {};

    function traverse(option, currentDepth) {
      if (!option.children) {
        return;
      }

      subOptionsRecord[option.value] = option.children;
      const nextDepth = currentDepth + 1;

      if (nextDepth > depth) {
        depth = nextDepth;
      }

      option.children.forEach(option => {
        traverse(option, nextDepth);
      });
    }

    options.forEach(option => {
      traverse(option, 1);
    });
    return {
      depth,
      subOptionsRecord
    };
  }, [options]);
}