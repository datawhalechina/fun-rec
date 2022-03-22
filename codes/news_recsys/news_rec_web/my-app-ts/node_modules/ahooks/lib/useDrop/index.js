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

var react_1 = require("react");

var useDrop = function useDrop(target, options) {
  if (options === void 0) {
    options = {};
  }

  var optionsRef = useLatest_1["default"](options); // https://stackoverflow.com/a/26459269

  var dragEnterTarget = react_1.useRef();
  useEffectWithTarget_1["default"](function () {
    var targetElement = domTarget_1.getTargetElement(target);

    if (!(targetElement === null || targetElement === void 0 ? void 0 : targetElement.addEventListener)) {
      return;
    }

    var onData = function onData(dataTransfer, event) {
      var uri = dataTransfer.getData('text/uri-list');
      var dom = dataTransfer.getData('custom');

      if (dom && optionsRef.current.onDom) {
        var data = dom;

        try {
          data = JSON.parse(dom);
        } catch (e) {
          data = dom;
        }

        optionsRef.current.onDom(data, event);
        return;
      }

      if (uri && optionsRef.current.onUri) {
        optionsRef.current.onUri(uri, event);
        return;
      }

      if (dataTransfer.files && dataTransfer.files.length && optionsRef.current.onFiles) {
        optionsRef.current.onFiles(Array.from(dataTransfer.files), event);
        return;
      }

      if (dataTransfer.items && dataTransfer.items.length && optionsRef.current.onText) {
        dataTransfer.items[0].getAsString(function (text) {
          optionsRef.current.onText(text, event);
        });
      }
    };

    var onDragEnter = function onDragEnter(event) {
      var _a, _b;

      event.preventDefault();
      event.stopPropagation();
      dragEnterTarget.current = event.target;
      (_b = (_a = optionsRef.current).onDragEnter) === null || _b === void 0 ? void 0 : _b.call(_a, event);
    };

    var onDragOver = function onDragOver(event) {
      var _a, _b;

      event.preventDefault();
      (_b = (_a = optionsRef.current).onDragOver) === null || _b === void 0 ? void 0 : _b.call(_a, event);
    };

    var onDragLeave = function onDragLeave(event) {
      var _a, _b;

      if (event.target === dragEnterTarget.current) {
        (_b = (_a = optionsRef.current).onDragLeave) === null || _b === void 0 ? void 0 : _b.call(_a, event);
      }
    };

    var onDrop = function onDrop(event) {
      var _a, _b;

      event.preventDefault();
      onData(event.dataTransfer, event);
      (_b = (_a = optionsRef.current).onDrop) === null || _b === void 0 ? void 0 : _b.call(_a, event);
    };

    var onPaste = function onPaste(event) {
      var _a, _b;

      onData(event.clipboardData, event);
      (_b = (_a = optionsRef.current).onPaste) === null || _b === void 0 ? void 0 : _b.call(_a, event);
    };

    targetElement.addEventListener('dragenter', onDragEnter);
    targetElement.addEventListener('dragover', onDragOver);
    targetElement.addEventListener('dragleave', onDragLeave);
    targetElement.addEventListener('drop', onDrop);
    targetElement.addEventListener('paste', onPaste);
    return function () {
      targetElement.removeEventListener('dragenter', onDragEnter);
      targetElement.removeEventListener('dragover', onDragOver);
      targetElement.removeEventListener('dragleave', onDragLeave);
      targetElement.removeEventListener('drop', onDrop);
      targetElement.removeEventListener('paste', onPaste);
    };
  }, [], target);
};

exports["default"] = useDrop;