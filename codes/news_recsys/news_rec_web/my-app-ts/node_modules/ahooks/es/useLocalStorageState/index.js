import { createUseStorageState } from '../createUseStorageState';
import isBrowser from '../utils/isBrowser';
var useLocalStorageState = createUseStorageState(function () {
  return isBrowser ? localStorage : undefined;
});
export default useLocalStorageState;