import type { Data, Params, Service } from '../useAntdTable/types';
import type { FusionTableOptions, FusionTableResult } from './types';
declare const useFusionTable: <TData extends Data, TParams extends Params>(service: Service<TData, TParams>, options?: FusionTableOptions<TData, TParams>) => FusionTableResult<TData, TParams>;
export default useFusionTable;
