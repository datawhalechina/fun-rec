import { useMemo } from 'react';
import { withCache } from '../../utils/with-cache';
export function generateColumnsExtend(rawColumns, val) {
  const columns = withCache(() => {
    const c = typeof rawColumns === 'function' ? rawColumns(val) : rawColumns;
    return c.map(column => column.map(item => typeof item === 'string' ? {
      label: item,
      value: item
    } : item));
  });
  const items = withCache(() => {
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
export function useColumnsExtend(rawColumns, value) {
  return useMemo(() => generateColumnsExtend(rawColumns, value), [rawColumns, value]);
}