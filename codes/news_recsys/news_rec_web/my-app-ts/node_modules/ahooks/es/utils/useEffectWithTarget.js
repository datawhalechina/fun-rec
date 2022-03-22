import { useEffect } from 'react';
import createEffectWithTarget from './createEffectWithTarget';
var useEffectWithTarget = createEffectWithTarget(useEffect);
export default useEffectWithTarget;