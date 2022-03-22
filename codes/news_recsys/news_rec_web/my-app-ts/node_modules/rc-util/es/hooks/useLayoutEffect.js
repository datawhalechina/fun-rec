import * as React from 'react';
import canUseDom from '../Dom/canUseDom';
/**
 * Wrap `React.useLayoutEffect` which will not throw warning message in test env
 */

var useLayoutEffect = process.env.NODE_ENV !== 'test' && canUseDom() ? React.useLayoutEffect : React.useEffect;
export default useLayoutEffect;