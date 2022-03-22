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

var __spread = this && this.__spread || function () {
  for (var ar = [], i = 0; i < arguments.length; i++) {
    ar = ar.concat(__read(arguments[i]));
  }

  return ar;
};

import { useRef, useState } from 'react';
import useMemoizedFn from '../useMemoizedFn';

var dumpIndex = function dumpIndex(step, arr) {
  var index = step > 0 ? step - 1 // move forward
  : arr.length + step; // move backward

  if (index >= arr.length - 1) {
    index = arr.length - 1;
  }

  if (index < 0) {
    index = 0;
  }

  return index;
};

var split = function split(step, targetArr) {
  var index = dumpIndex(step, targetArr);
  return {
    _current: targetArr[index],
    _before: targetArr.slice(0, index),
    _after: targetArr.slice(index + 1)
  };
};

export default function useHistoryTravel(initialValue) {
  var _a = __read(useState({
    present: initialValue,
    past: [],
    future: []
  }), 2),
      history = _a[0],
      setHistory = _a[1];

  var present = history.present,
      past = history.past,
      future = history.future;
  var initialValueRef = useRef(initialValue);

  var reset = function reset() {
    var params = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      params[_i] = arguments[_i];
    }

    var _initial = params.length > 0 ? params[0] : initialValueRef.current;

    initialValueRef.current = _initial;
    setHistory({
      present: _initial,
      future: [],
      past: []
    });
  };

  var updateValue = function updateValue(val) {
    setHistory({
      present: val,
      future: [],
      past: __spread(past, [present])
    });
  };

  var _forward = function _forward(step) {
    if (step === void 0) {
      step = 1;
    }

    if (future.length === 0) {
      return;
    }

    var _a = split(step, future),
        _before = _a._before,
        _current = _a._current,
        _after = _a._after;

    setHistory({
      past: __spread(past, [present], _before),
      present: _current,
      future: _after
    });
  };

  var _backward = function _backward(step) {
    if (step === void 0) {
      step = -1;
    }

    if (past.length === 0) {
      return;
    }

    var _a = split(step, past),
        _before = _a._before,
        _current = _a._current,
        _after = _a._after;

    setHistory({
      past: _before,
      present: _current,
      future: __spread(_after, [present], future)
    });
  };

  var go = function go(step) {
    var stepNum = typeof step === 'number' ? step : Number(step);

    if (stepNum === 0) {
      return;
    }

    if (stepNum > 0) {
      return _forward(stepNum);
    }

    _backward(stepNum);
  };

  return {
    value: present,
    backLength: past.length,
    forwardLength: future.length,
    setValue: useMemoizedFn(updateValue),
    go: useMemoizedFn(go),
    back: useMemoizedFn(function () {
      go(-1);
    }),
    forward: useMemoizedFn(function () {
      go(1);
    }),
    reset: useMemoizedFn(reset)
  };
}