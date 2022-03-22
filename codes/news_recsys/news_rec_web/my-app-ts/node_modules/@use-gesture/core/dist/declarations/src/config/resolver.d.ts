import { GestureKey, InternalConfig, UserGestureConfig } from '../types';
export declare type Resolver = (x: any, key: string, obj: any) => any;
export declare type ResolverMap = {
    [k: string]: Resolver | ResolverMap | boolean;
};
export declare function resolveWith<T extends {
    [k: string]: any;
}, V extends {
    [k: string]: any;
}>(config: Partial<T> | undefined, resolvers: ResolverMap): V;
export declare function parse(config: UserGestureConfig, gestureKey?: GestureKey): InternalConfig;
