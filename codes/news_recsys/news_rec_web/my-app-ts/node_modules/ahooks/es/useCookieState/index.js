var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __rest = this && this.__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

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

import Cookies from 'js-cookie';
import { useState } from 'react';
import useMemoizedFn from '../useMemoizedFn';
import { isFunction } from '../utils';

function useCookieState(cookieKey, options) {
  if (options === void 0) {
    options = {};
  }

  var _a = __read(useState(function () {
    var cookieValue = Cookies.get(cookieKey);
    if (typeof cookieValue === 'string') return cookieValue;

    if (isFunction(options.defaultValue)) {
      return options.defaultValue();
    }

    return options.defaultValue;
  }), 2),
      state = _a[0],
      setState = _a[1];

  var updateState = useMemoizedFn(function (newValue, newOptions) {
    if (newOptions === void 0) {
      newOptions = {};
    }

    var _a = __assign(__assign({}, options), newOptions),
        defaultValue = _a.defaultValue,
        restOptions = __rest(_a, ["defaultValue"]);

    setState(function (prevState) {
      var value = isFunction(newValue) ? newValue(prevState) : newValue;

      if (value === undefined) {
        Cookies.remove(cookieKey);
      } else {
        Cookies.set(cookieKey, value, restOptions);
      }

      return value;
    });
  });
  return [state, updateState];
}

export default useCookieState;