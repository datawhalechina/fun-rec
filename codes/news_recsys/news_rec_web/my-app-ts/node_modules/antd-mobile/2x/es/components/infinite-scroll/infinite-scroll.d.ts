import { FC } from 'react';
import { NativeProps } from '../../utils/native-props';
export declare type InfiniteScrollProps = {
    loadMore: () => Promise<void>;
    hasMore: boolean;
    threshold?: number;
} & NativeProps;
export declare const InfiniteScroll: FC<InfiniteScrollProps>;
