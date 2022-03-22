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

import { useState } from 'react';
import useMemoizedFn from '../useMemoizedFn';

function useSet(initialValue) {
  var getInitValue = function getInitValue() {
    return initialValue === undefined ? new Set() : new Set(initialValue);
  };

  var _a = __read(useState(function () {
    return getInitValue();
  }), 2),
      set = _a[0],
      setSet = _a[1];

  var add = function add(key) {
    if (set.has(key)) {
      return;
    }

    setSet(function (prevSet) {
      var temp = new Set(prevSet);
      temp.add(key);
      return temp;
    });
  };

  var remove = function remove(key) {
    if (!set.has(key)) {
      return;
    }

    setSet(function (prevSet) {
      var temp = new Set(prevSet);
      temp["delete"](key);
      return temp;
    });
  };

  var reset = function reset() {
    return setSet(getInitValue());
  };

  return [set, {
    add: useMemoizedFn(add),
    remove: useMemoizedFn(remove),
    reset: useMemoizedFn(reset)
  }];
}

export default useSet;