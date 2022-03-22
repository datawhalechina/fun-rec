import { useRef } from 'react';
import useUnmount from '../useUnmount';
import depsAreSame from './depsAreSame';
import { getTargetElement } from './domTarget';

var createEffectWithTarget = function createEffectWithTarget(useEffectType) {
  /**
   *
   * @param effect
   * @param deps
   * @param target target should compare ref.current vs ref.current, dom vs dom, ()=>dom vs ()=>dom
   */
  var useEffectWithTarget = function useEffectWithTarget(effect, deps, target) {
    var hasInitRef = useRef(false);
    var lastElementRef = useRef([]);
    var lastDepsRef = useRef([]);
    var unLoadRef = useRef();
    useEffectType(function () {
      var _a;

      var targets = Array.isArray(target) ? target : [target];
      var els = targets.map(function (item) {
        return getTargetElement(item);
      }); // init run

      if (!hasInitRef.current) {
        hasInitRef.current = true;
        lastElementRef.current = els;
        lastDepsRef.current = deps;
        unLoadRef.current = effect();
        return;
      }

      if (els.length !== lastElementRef.current.length || !depsAreSame(els, lastElementRef.current) || !depsAreSame(deps, lastDepsRef.current)) {
        (_a = unLoadRef.current) === null || _a === void 0 ? void 0 : _a.call(unLoadRef);
        lastElementRef.current = els;
        lastDepsRef.current = deps;
        unLoadRef.current = effect();
      }
    });
    useUnmount(function () {
      var _a;

      (_a = unLoadRef.current) === null || _a === void 0 ? void 0 : _a.call(unLoadRef); // for react-refresh

      hasInitRef.current = false;
    });
  };

  return useEffectWithTarget;
};

export default createEffectWithTarget;