import type { Options, Plugin, Result, Service } from './types';
declare function useRequestImplement<TData, TParams extends any[]>(service: Service<TData, TParams>, options?: Options<TData, TParams>, plugins?: Plugin<TData, TParams>[]): Result<TData, TParams>;
export default useRequestImplement;
