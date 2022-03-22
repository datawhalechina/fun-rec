import type { Data, PaginationOptions, Params, Service, PaginationResult } from './types';
declare const usePagination: <TData extends Data, TParams extends Params>(service: Service<TData, TParams>, options?: PaginationOptions<TData, TParams>) => PaginationResult<TData, TParams>;
export default usePagination;
