import { createUseStorageState } from '../createUseStorageState';
import isBrowser from '../utils/isBrowser';
var useSessionStorageState = createUseStorageState(function () {
  return isBrowser ? sessionStorage : undefined;
});
export default useSessionStorageState;