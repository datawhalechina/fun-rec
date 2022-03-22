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

var useDrag = function useDrag(data, target, options) {
  if (options === void 0) {
    options = {};
  }

  var optionsRef = useLatest_1["default"](options);
  useEffectWithTarget_1["default"](function () {
    var targetElement = domTarget_1.getTargetElement(target);

    if (!(targetElement === null || targetElement === void 0 ? void 0 : targetElement.addEventListener)) {
      return;
    }

    var onDragStart = function onDragStart(event) {
      var _a, _b;

      (_b = (_a = optionsRef.current).onDragStart) === null || _b === void 0 ? void 0 : _b.call(_a, event);
      event.dataTransfer.setData('custom', JSON.stringify(data));
    };

    var onDragEnd = function onDragEnd(event) {
      var _a, _b;

      (_b = (_a = optionsRef.current).onDragEnd) === null || _b === void 0 ? void 0 : _b.call(_a, event);
    };

    targetElement.setAttribute('draggable', 'true');
    targetElement.addEventListener('dragstart', onDragStart);
    targetElement.addEventListener('dragend', onDragEnd);
    return function () {
      targetElement.removeEventListener('dragstart', onDragStart);
      targetElement.removeEventListener('dragend', onDragEnd);
    };
  }, [], target);
};

exports["default"] = useDrag;