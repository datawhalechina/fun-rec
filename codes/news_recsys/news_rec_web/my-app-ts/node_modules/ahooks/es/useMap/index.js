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

function useMap(initialValue) {
  var getInitValue = function getInitValue() {
    return initialValue === undefined ? new Map() : new Map(initialValue);
  };

  var _a = __read(useState(function () {
    return getInitValue();
  }), 2),
      map = _a[0],
      setMap = _a[1];

  var set = function set(key, entry) {
    setMap(function (prev) {
      var temp = new Map(prev);
      temp.set(key, entry);
      return temp;
    });
  };

  var setAll = function setAll(newMap) {
    setMap(new Map(newMap));
  };

  var remove = function remove(key) {
    setMap(function (prev) {
      var temp = new Map(prev);
      temp["delete"](key);
      return temp;
    });
  };

  var reset = function reset() {
    return setMap(getInitValue());
  };

  var get = function get(key) {
    return map.get(key);
  };

  return [map, {
    set: useMemoizedFn(set),
    setAll: useMemoizedFn(setAll),
    remove: useMemoizedFn(remove),
    reset: useMemoizedFn(reset),
    get: useMemoizedFn(get)
  }];
}

export default useMap;