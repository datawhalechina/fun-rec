import type { DependencyList } from 'react';
declare function useAsyncEffect(effect: () => AsyncGenerator<void, void, void> | Promise<void>, deps: DependencyList): void;
export default useAsyncEffect;
