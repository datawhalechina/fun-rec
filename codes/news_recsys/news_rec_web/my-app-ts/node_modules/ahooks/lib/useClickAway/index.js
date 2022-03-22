"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var useLatest_1 = __importDefault(require("../useLatest"));

var domTarget_1 = require("../utils/domTarget");

var useEffectWithTarget_1 = __importDefault(require("../utils/useEffectWithTarget"));

function useClickAway(onClickAway, target, eventName) {
  if (eventName === void 0) {
    eventName = 'click';
  }

  var onClickAwayRef = useLatest_1["default"](onClickAway);
  useEffectWithTarget_1["default"](function () {
    var handler = function handler(event) {
      var targets = Array.isArray(target) ? target : [target];

      if (targets.some(function (item) {
        var targetElement = domTarget_1.getTargetElement(item);
        return !targetElement || (targetElement === null || targetElement === void 0 ? void 0 : targetElement.contains(event.target));
      })) {
        return;
      }

      onClickAwayRef.current(event);
    };

    var eventNames = Array.isArray(eventName) ? eventName : [eventName];
    eventNames.forEach(function (event) {
      return document.addEventListener(event, handler);
    });
    return function () {
      eventNames.forEach(function (event) {
        return document.removeEventListener(event, handler);
      });
    };
  }, Array.isArray(eventName) ? eventName : [eventName], target);
}

exports["default"] = useClickAway;