import type { MutableRefObject } from 'react';
import type { FetchState, Options, PluginReturn, Service, Subscribe } from './types';
export default class Fetch<TData, TParams extends any[]> {
    serviceRef: MutableRefObject<Service<TData, TParams>>;
    options: Options<TData, TParams>;
    subscribe: Subscribe;
    initState: Partial<FetchState<TData, TParams>>;
    pluginImpls: PluginReturn<TData, TParams>[];
    count: number;
    state: FetchState<TData, TParams>;
    constructor(serviceRef: MutableRefObject<Service<TData, TParams>>, options: Options<TData, TParams>, subscribe: Subscribe, initState?: Partial<FetchState<TData, TParams>>);
    setState(s?: Partial<FetchState<TData, TParams>>): void;
    runPluginHandler(event: keyof PluginReturn<TData, TParams>, ...rest: any[]): any;
    runAsync(...params: TParams): Promise<TData>;
    run(...params: TParams): void;
    cancel(): void;
    refresh(): void;
    refreshAsync(): Promise<TData>;
    mutate(data?: TData | ((oldData?: TData) => TData | undefined)): void;
}
