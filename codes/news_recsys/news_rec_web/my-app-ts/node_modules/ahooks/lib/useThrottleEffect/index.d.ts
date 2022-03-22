import type { DependencyList, EffectCallback } from 'react';
import type { ThrottleOptions } from '../useThrottle/throttleOptions';
declare function useThrottleEffect(effect: EffectCallback, deps?: DependencyList, options?: ThrottleOptions): void;
export default useThrottleEffect;
