import { ReactElement } from 'react';
export declare type GetContainer = HTMLElement | (() => HTMLElement) | null;
export declare function renderToContainer(getContainer: GetContainer, node: ReactElement): ReactElement<any, string | import("react").JSXElementConstructor<any>>;
