import type { Dispatch, SetStateAction } from 'react';
declare function useSafeState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
declare function useSafeState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
export default useSafeState;
