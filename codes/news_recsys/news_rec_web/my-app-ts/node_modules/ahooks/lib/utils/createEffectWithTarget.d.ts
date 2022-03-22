import type { DependencyList, EffectCallback, useEffect, useLayoutEffect } from 'react';
import type { BasicTarget } from './domTarget';
declare const createEffectWithTarget: (useEffectType: typeof useEffect | typeof useLayoutEffect) => (effect: EffectCallback, deps: DependencyList, target: BasicTarget<any> | BasicTarget<any>[]) => void;
export default createEffectWithTarget;
