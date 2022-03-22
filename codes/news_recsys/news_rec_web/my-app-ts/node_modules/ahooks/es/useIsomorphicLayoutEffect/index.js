import { useEffect, useLayoutEffect } from 'react';
import isBrowser from '../utils/isBrowser';
var useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;
export default useIsomorphicLayoutEffect;