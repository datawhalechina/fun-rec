import type { DependencyList } from 'react';
declare type Effect = (changes?: number[], previousDeps?: DependencyList, currentDeps?: DependencyList) => void | (() => void);
declare const useTrackedEffect: (effect: Effect, deps?: DependencyList | undefined) => void;
export default useTrackedEffect;
