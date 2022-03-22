/// <reference types="react" />
import type { Data, InfiniteScrollOptions, Service } from './types';
declare const useInfiniteScroll: <TData extends Data>(service: Service<TData>, options?: InfiniteScrollOptions<TData>) => {
    data: TData | undefined;
    loading: boolean;
    loadingMore: boolean;
    noMore: boolean;
    loadMore: (this: unknown) => void;
    loadMoreAsync: (this: unknown) => Promise<TData> | undefined;
    reload: (this: unknown) => void;
    reloadAsync: (this: unknown) => Promise<TData>;
    mutate: import("react").Dispatch<import("react").SetStateAction<TData | undefined>>;
    cancel: () => void;
};
export default useInfiniteScroll;
