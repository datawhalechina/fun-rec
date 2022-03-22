import type { Options, Plugin, Service } from './types';
declare function useRequest<TData, TParams extends any[]>(service: Service<TData, TParams>, options?: Options<TData, TParams>, plugins?: Plugin<TData, TParams>[]): import("./types").Result<TData, TParams>;
export default useRequest;
