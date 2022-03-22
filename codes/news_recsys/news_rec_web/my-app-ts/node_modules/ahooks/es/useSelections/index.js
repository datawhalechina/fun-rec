var __read = this && this.__read || function (o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) {
      ar.push(r.value);
    }
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
};

import { useMemo, useState } from 'react';
import useMemoizedFn from '../useMemoizedFn';
export default function useSelections(items, defaultSelected) {
  if (defaultSelected === void 0) {
    defaultSelected = [];
  }

  var _a = __read(useState(defaultSelected), 2),
      selected = _a[0],
      setSelected = _a[1];

  var selectedSet = useMemo(function () {
    return new Set(selected);
  }, [selected]);

  var isSelected = function isSelected(item) {
    return selectedSet.has(item);
  };

  var select = function select(item) {
    selectedSet.add(item);
    return setSelected(Array.from(selectedSet));
  };

  var unSelect = function unSelect(item) {
    selectedSet["delete"](item);
    return setSelected(Array.from(selectedSet));
  };

  var toggle = function toggle(item) {
    if (isSelected(item)) {
      unSelect(item);
    } else {
      select(item);
    }
  };

  var selectAll = function selectAll() {
    items.forEach(function (o) {
      selectedSet.add(o);
    });
    setSelected(Array.from(selectedSet));
  };

  var unSelectAll = function unSelectAll() {
    items.forEach(function (o) {
      selectedSet["delete"](o);
    });
    setSelected(Array.from(selectedSet));
  };

  var noneSelected = useMemo(function () {
    return items.every(function (o) {
      return !selectedSet.has(o);
    });
  }, [items, selectedSet]);
  var allSelected = useMemo(function () {
    return items.every(function (o) {
      return selectedSet.has(o);
    }) && !noneSelected;
  }, [items, selectedSet, noneSelected]);
  var partiallySelected = useMemo(function () {
    return !noneSelected && !allSelected;
  }, [noneSelected, allSelected]);

  var toggleAll = function toggleAll() {
    return allSelected ? unSelectAll() : selectAll();
  };

  return {
    selected: selected,
    noneSelected: noneSelected,
    allSelected: allSelected,
    partiallySelected: partiallySelected,
    setSelected: setSelected,
    isSelected: isSelected,
    select: useMemoizedFn(select),
    unSelect: useMemoizedFn(unSelect),
    toggle: useMemoizedFn(toggle),
    selectAll: useMemoizedFn(selectAll),
    unSelectAll: useMemoizedFn(unSelectAll),
    toggleAll: useMemoizedFn(toggleAll)
  };
}