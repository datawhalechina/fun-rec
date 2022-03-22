import type { Dispatch, SetStateAction } from 'react';
declare type GetStateAction<S> = () => S;
declare function useGetState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>, GetStateAction<S>];
declare function useGetState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>, GetStateAction<S | undefined>];
export default useGetState;
