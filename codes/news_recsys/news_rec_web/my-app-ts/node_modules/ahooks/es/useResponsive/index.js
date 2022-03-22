var __values = this && this.__values || function (o) {
  var s = typeof Symbol === "function" && Symbol.iterator,
      m = s && o[s],
      i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function next() {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
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

import { useEffect, useState } from 'react';
var subscribers = new Set();
var info;
var responsiveConfig = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200
};

function handleResize() {
  var e_1, _a;

  var oldInfo = info;
  calculate();
  if (oldInfo === info) return;

  try {
    for (var subscribers_1 = __values(subscribers), subscribers_1_1 = subscribers_1.next(); !subscribers_1_1.done; subscribers_1_1 = subscribers_1.next()) {
      var subscriber = subscribers_1_1.value;
      subscriber();
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (subscribers_1_1 && !subscribers_1_1.done && (_a = subscribers_1["return"])) _a.call(subscribers_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }
}

var listening = false;

function calculate() {
  var e_2, _a;

  var width = window.innerWidth;
  var newInfo = {};
  var shouldUpdate = false;

  try {
    for (var _b = __values(Object.keys(responsiveConfig)), _c = _b.next(); !_c.done; _c = _b.next()) {
      var key = _c.value;
      newInfo[key] = width >= responsiveConfig[key];

      if (newInfo[key] !== info[key]) {
        shouldUpdate = true;
      }
    }
  } catch (e_2_1) {
    e_2 = {
      error: e_2_1
    };
  } finally {
    try {
      if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
    } finally {
      if (e_2) throw e_2.error;
    }
  }

  if (shouldUpdate) {
    info = newInfo;
  }
}

export function configResponsive(config) {
  responsiveConfig = config;
  if (info) calculate();
}
export function useResponsive() {
  var windowExists = typeof window !== 'undefined';

  if (windowExists && !listening) {
    info = {};
    calculate();
    window.addEventListener('resize', handleResize);
    listening = true;
  }

  var _a = __read(useState(info), 2),
      state = _a[0],
      setState = _a[1];

  useEffect(function () {
    if (!windowExists) return;

    var subscriber = function subscriber() {
      setState(info);
    };

    subscribers.add(subscriber);
    return function () {
      subscribers["delete"](subscriber);

      if (subscribers.size === 0) {
        window.removeEventListener('resize', handleResize);
        listening = false;
      }
    };
  }, []);
  return state;
}