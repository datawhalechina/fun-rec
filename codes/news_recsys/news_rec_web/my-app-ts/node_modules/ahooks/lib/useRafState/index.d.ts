import type { Dispatch, SetStateAction } from 'react';
declare function useRafState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
declare function useRafState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
export default useRafState;
