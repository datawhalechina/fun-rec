import { useLayoutEffect } from 'react';
import createEffectWithTarget from './createEffectWithTarget';
var useEffectWithTarget = createEffectWithTarget(useLayoutEffect);
export default useEffectWithTarget;