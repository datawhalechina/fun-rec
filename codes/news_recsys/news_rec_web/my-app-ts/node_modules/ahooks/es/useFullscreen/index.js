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
import screenfull from 'screenfull';
import useLatest from '../useLatest';
import useMemoizedFn from '../useMemoizedFn';
import useUnmount from '../useUnmount';
import { getTargetElement } from '../utils/domTarget';

var useFullscreen = function useFullscreen(target, options) {
  var _a = options || {},
      onExit = _a.onExit,
      onEnter = _a.onEnter;

  var onExitRef = useLatest(onExit);
  var onEnterRef = useLatest(onEnter);

  var _b = __read(useState(false), 2),
      state = _b[0],
      setState = _b[1];

  var onChange = function onChange() {
    var _a, _b;

    if (screenfull.isEnabled) {
      var isFullscreen = screenfull.isFullscreen;

      if (isFullscreen) {
        (_a = onEnterRef.current) === null || _a === void 0 ? void 0 : _a.call(onEnterRef);
      } else {
        screenfull.off('change', onChange);
        (_b = onExitRef.current) === null || _b === void 0 ? void 0 : _b.call(onExitRef);
      }

      setState(isFullscreen);
    }
  };

  var enterFullscreen = function enterFullscreen() {
    var el = getTargetElement(target);

    if (!el) {
      return;
    }

    if (screenfull.isEnabled) {
      try {
        screenfull.request(el);
        screenfull.on('change', onChange);
      } catch (error) {
        console.error(error);
      }
    }
  };

  var exitFullscreen = function exitFullscreen() {
    if (!state) {
      return;
    }

    if (screenfull.isEnabled) {
      screenfull.exit();
    }
  };

  var toggleFullscreen = function toggleFullscreen() {
    if (state) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  useUnmount(function () {
    if (screenfull.isEnabled) {
      screenfull.off('change', onChange);
    }
  });
  return [state, {
    enterFullscreen: useMemoizedFn(enterFullscreen),
    exitFullscreen: useMemoizedFn(exitFullscreen),
    toggleFullscreen: useMemoizedFn(toggleFullscreen),
    isEnabled: screenfull.isEnabled
  }];
};

export default useFullscreen;