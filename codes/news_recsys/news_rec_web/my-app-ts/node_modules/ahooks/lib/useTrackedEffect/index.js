"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var diffTwoDeps = function diffTwoDeps(deps1, deps2) {
  //Let's do a reference equality check on 2 dependency list.
  //If deps1 is defined, we iterate over deps1 and do comparison on each element with equivalent element from deps2
  //As this func is used only in this hook, we assume 2 deps always have same length.
  return deps1 ? deps1.map(function (_ele, idx) {
    return deps1[idx] !== (deps2 === null || deps2 === void 0 ? void 0 : deps2[idx]) ? idx : -1;
  }).filter(function (ele) {
    return ele >= 0;
  }) : deps2 ? deps2.map(function (_ele, idx) {
    return idx;
  }) : [];
};

var useTrackedEffect = function useTrackedEffect(effect, deps) {
  var previousDepsRef = react_1.useRef();
  react_1.useEffect(function () {
    var changes = diffTwoDeps(previousDepsRef.current, deps);
    var previousDeps = previousDepsRef.current;
    previousDepsRef.current = deps;
    return effect(changes, previousDeps, deps);
  }, deps);
};

exports["default"] = useTrackedEffect;