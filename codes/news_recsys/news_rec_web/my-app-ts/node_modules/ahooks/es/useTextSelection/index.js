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

import { useRef, useState } from 'react';
import { getTargetElement } from '../utils/domTarget';
import useEffectWithTarget from '../utils/useEffectWithTarget';
var initRect = {
  top: NaN,
  left: NaN,
  bottom: NaN,
  right: NaN,
  height: NaN,
  width: NaN
};

var initState = __assign({
  text: ''
}, initRect);

function getRectFromSelection(selection) {
  if (!selection) {
    return initRect;
  }

  if (selection.rangeCount < 1) {
    return initRect;
  }

  var range = selection.getRangeAt(0);

  var _a = range.getBoundingClientRect(),
      height = _a.height,
      width = _a.width,
      top = _a.top,
      left = _a.left,
      right = _a.right,
      bottom = _a.bottom;

  return {
    height: height,
    width: width,
    top: top,
    left: left,
    right: right,
    bottom: bottom
  };
}

function useTextSelection(target) {
  var _a = __read(useState(initState), 2),
      state = _a[0],
      setState = _a[1];

  var stateRef = useRef(state);
  stateRef.current = state;
  useEffectWithTarget(function () {
    var el = getTargetElement(target, document);

    if (!el) {
      return;
    }

    var mouseupHandler = function mouseupHandler() {
      var selObj = null;
      var text = '';
      var rect = initRect;
      if (!window.getSelection) return;
      selObj = window.getSelection();
      text = selObj ? selObj.toString() : '';

      if (text) {
        rect = getRectFromSelection(selObj);
        setState(__assign(__assign(__assign({}, state), {
          text: text
        }), rect));
      }
    }; // 任意点击都需要清空之前的 range


    var mousedownHandler = function mousedownHandler() {
      if (!window.getSelection) return;

      if (stateRef.current.text) {
        setState(__assign({}, initState));
      }

      var selObj = window.getSelection();
      if (!selObj) return;
      selObj.removeAllRanges();
    };

    el.addEventListener('mouseup', mouseupHandler);
    document.addEventListener('mousedown', mousedownHandler);
    return function () {
      el.removeEventListener('mouseup', mouseupHandler);
      document.removeEventListener('mousedown', mousedownHandler);
    };
  }, [], target);
  return state;
}

export default useTextSelection;