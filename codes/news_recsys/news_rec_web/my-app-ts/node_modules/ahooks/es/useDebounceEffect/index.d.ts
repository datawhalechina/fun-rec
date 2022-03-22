import type { DependencyList, EffectCallback } from 'react';
import type { DebounceOptions } from '../useDebounce/debounceOptions';
declare function useDebounceEffect(effect: EffectCallback, deps?: DependencyList, options?: DebounceOptions): void;
export default useDebounceEffect;
