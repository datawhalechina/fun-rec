import type { DependencyList } from 'react';
export default function useCreation<T>(factory: () => T, deps: DependencyList): T;
