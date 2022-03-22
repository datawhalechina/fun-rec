import isEqual from 'lodash/isEqual';
import { useRef } from 'react';
import useEffectWithTarget from './useEffectWithTarget';

var depsEqual = function depsEqual(aDeps, bDeps) {
  if (bDeps === void 0) {
    bDeps = [];
  }

  return isEqual(aDeps, bDeps);
};

var useDeepCompareEffectWithTarget = function useDeepCompareEffectWithTarget(effect, deps, target) {
  var ref = useRef();
  var signalRef = useRef(0);

  if (!depsEqual(deps, ref.current)) {
    ref.current = deps;
    signalRef.current += 1;
  }

  useEffectWithTarget(effect, [signalRef.current], target);
};

export default useDeepCompareEffectWithTarget;