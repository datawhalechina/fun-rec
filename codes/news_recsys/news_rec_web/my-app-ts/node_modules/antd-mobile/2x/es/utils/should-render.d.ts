import { FC, ReactElement } from 'react';
interface Props {
    active: boolean;
    forceRender?: boolean;
    destroyOnClose?: boolean;
    children: ReactElement;
}
export declare const ShouldRender: FC<Props>;
export declare function useShouldRender(active: boolean, forceRender?: boolean, destroyOnClose?: boolean): boolean;
export {};
