import isBrowser from './isBrowser';
import useEffectWithTarget from './useEffectWithTarget';
import useLayoutEffectWithTarget from './useLayoutEffectWithTarget';
var useIsomorphicLayoutEffectWithTarget = isBrowser ? useLayoutEffectWithTarget : useEffectWithTarget;
export default useIsomorphicLayoutEffectWithTarget;