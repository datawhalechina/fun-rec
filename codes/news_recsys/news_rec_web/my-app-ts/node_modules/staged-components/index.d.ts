import { FC, PropsWithChildren, ReactElement, Ref, RefForwardingComponent } from 'react';
declare type StageRender = () => StageRender | ReactElement | null;
declare type StageRenderRoot<P> = (props: PropsWithChildren<P>) => StageRender | ReactElement | null;
declare type StageRenderRootWithRef<P, R> = (props: PropsWithChildren<P>, ref: Ref<R>) => StageRender | ReactElement | null;
export declare function staged<P = {}>(stage: StageRenderRoot<P>): FC<P>;
export declare function staged<P = {}, R = any>(stage: StageRenderRootWithRef<P, R>): RefForwardingComponent<R, P>;
export {};
