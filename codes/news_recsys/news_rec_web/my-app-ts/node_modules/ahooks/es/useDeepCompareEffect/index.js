import isEqual from 'lodash/isEqual';
import { useEffect, useRef } from 'react';

var depsEqual = function depsEqual(aDeps, bDeps) {
  if (bDeps === void 0) {
    bDeps = [];
  }

  return isEqual(aDeps, bDeps);
};

var useDeepCompareEffect = function useDeepCompareEffect(effect, deps) {
  var ref = useRef();
  var signalRef = useRef(0);

  if (!depsEqual(deps, ref.current)) {
    ref.current = deps;
    signalRef.current += 1;
  }

  useEffect(effect, [signalRef.current]);
};

export default useDeepCompareEffect;