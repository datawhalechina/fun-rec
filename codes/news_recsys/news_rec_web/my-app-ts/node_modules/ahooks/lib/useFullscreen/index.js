"use strict";

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

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var screenfull_1 = __importDefault(require("screenfull"));

var useLatest_1 = __importDefault(require("../useLatest"));

var useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));

var useUnmount_1 = __importDefault(require("../useUnmount"));

var domTarget_1 = require("../utils/domTarget");

var useFullscreen = function useFullscreen(target, options) {
  var _a = options || {},
      onExit = _a.onExit,
      onEnter = _a.onEnter;

  var onExitRef = useLatest_1["default"](onExit);
  var onEnterRef = useLatest_1["default"](onEnter);

  var _b = __read(react_1.useState(false), 2),
      state = _b[0],
      setState = _b[1];

  var onChange = function onChange() {
    var _a, _b;

    if (screenfull_1["default"].isEnabled) {
      var isFullscreen = screenfull_1["default"].isFullscreen;

      if (isFullscreen) {
        (_a = onEnterRef.current) === null || _a === void 0 ? void 0 : _a.call(onEnterRef);
      } else {
        screenfull_1["default"].off('change', onChange);
        (_b = onExitRef.current) === null || _b === void 0 ? void 0 : _b.call(onExitRef);
      }

      setState(isFullscreen);
    }
  };

  var enterFullscreen = function enterFullscreen() {
    var el = domTarget_1.getTargetElement(target);

    if (!el) {
      return;
    }

    if (screenfull_1["default"].isEnabled) {
      try {
        screenfull_1["default"].request(el);
        screenfull_1["default"].on('change', onChange);
      } catch (error) {
        console.error(error);
      }
    }
  };

  var exitFullscreen = function exitFullscreen() {
    if (!state) {
      return;
    }

    if (screenfull_1["default"].isEnabled) {
      screenfull_1["default"].exit();
    }
  };

  var toggleFullscreen = function toggleFullscreen() {
    if (state) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  useUnmount_1["default"](function () {
    if (screenfull_1["default"].isEnabled) {
      screenfull_1["default"].off('change', onChange);
    }
  });
  return [state, {
    enterFullscreen: useMemoizedFn_1["default"](enterFullscreen),
    exitFullscreen: useMemoizedFn_1["default"](exitFullscreen),
    toggleFullscreen: useMemoizedFn_1["default"](toggleFullscreen),
    isEnabled: screenfull_1["default"].isEnabled
  }];
};

exports["default"] = useFullscreen;