"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var useUnmount_1 = __importDefault(require("../useUnmount"));

var depsAreSame_1 = __importDefault(require("./depsAreSame"));

var domTarget_1 = require("./domTarget");

var createEffectWithTarget = function createEffectWithTarget(useEffectType) {
  /**
   *
   * @param effect
   * @param deps
   * @param target target should compare ref.current vs ref.current, dom vs dom, ()=>dom vs ()=>dom
   */
  var useEffectWithTarget = function useEffectWithTarget(effect, deps, target) {
    var hasInitRef = react_1.useRef(false);
    var lastElementRef = react_1.useRef([]);
    var lastDepsRef = react_1.useRef([]);
    var unLoadRef = react_1.useRef();
    useEffectType(function () {
      var _a;

      var targets = Array.isArray(target) ? target : [target];
      var els = targets.map(function (item) {
        return domTarget_1.getTargetElement(item);
      }); // init run

      if (!hasInitRef.current) {
        hasInitRef.current = true;
        lastElementRef.current = els;
        lastDepsRef.current = deps;
        unLoadRef.current = effect();
        return;
      }

      if (els.length !== lastElementRef.current.length || !depsAreSame_1["default"](els, lastElementRef.current) || !depsAreSame_1["default"](deps, lastDepsRef.current)) {
        (_a = unLoadRef.current) === null || _a === void 0 ? void 0 : _a.call(unLoadRef);
        lastElementRef.current = els;
        lastDepsRef.current = deps;
        unLoadRef.current = effect();
      }
    });
    useUnmount_1["default"](function () {
      var _a;

      (_a = unLoadRef.current) === null || _a === void 0 ? void 0 : _a.call(unLoadRef); // for react-refresh

      hasInitRef.current = false;
    });
  };

  return useEffectWithTarget;
};

exports["default"] = createEffectWithTarget;