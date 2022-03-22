"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateColumnsExtend = generateColumnsExtend;
exports.useColumnsExtend = useColumnsExtend;

var _react = require("react");

var _withCache = require("../../utils/with-cache");

function generateColumnsExtend(rawColumns, val) {
  const columns = (0, _withCache.withCache)(() => {
    const c = typeof rawColumns === 'function' ? rawColumns(val) : rawColumns;
    return c.map(column => column.map(item => typeof item === 'string' ? {
      label: item,
      value: item
    } : item));
  });
  const items = (0, _withCache.withCache)(() => {
    return val.map((v, index) => {
      var _a;

      const column = columns()[index];
      if (!column) return null;
      return (_a = column.find(item => item.value === v)) !== null && _a !== void 0 ? _a : null;
    });
  });
  const extend = {
    get columns() {
      return columns();
    },

    get items() {
      return items();
    }

  };
  return extend;
}

function useColumnsExtend(rawColumns, value) {
  return (0, _react.useMemo)(() => generateColumnsExtend(rawColumns, value), [rawColumns, value]);
}