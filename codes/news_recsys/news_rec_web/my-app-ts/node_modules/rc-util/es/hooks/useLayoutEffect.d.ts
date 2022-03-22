import * as React from 'react';
/**
 * Wrap `React.useLayoutEffect` which will not throw warning message in test env
 */
declare const useLayoutEffect: typeof React.useEffect;
export default useLayoutEffect;
