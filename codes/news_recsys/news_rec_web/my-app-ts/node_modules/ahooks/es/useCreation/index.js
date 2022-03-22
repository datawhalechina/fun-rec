import { useRef } from 'react';
import depsAreSame from '../utils/depsAreSame';
export default function useCreation(factory, deps) {
  var current = useRef({
    deps: deps,
    obj: undefined,
    initialized: false
  }).current;

  if (current.initialized === false || !depsAreSame(current.deps, deps)) {
    current.deps = deps;
    current.obj = factory();
    current.initialized = true;
  }

  return current.obj;
}