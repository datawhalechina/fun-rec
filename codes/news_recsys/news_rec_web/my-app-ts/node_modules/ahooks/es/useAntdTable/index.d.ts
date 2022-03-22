import type { AntdTableOptions, Data, Params, Service, AntdTableResult } from './types';
declare const useAntdTable: <TData extends Data, TParams extends Params>(service: Service<TData, TParams>, options?: AntdTableOptions<TData, TParams>) => AntdTableResult<TData, TParams>;
export default useAntdTable;
