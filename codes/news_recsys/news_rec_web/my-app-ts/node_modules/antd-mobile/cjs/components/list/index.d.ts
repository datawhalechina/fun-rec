/// <reference types="react" />
import './list.less';
export type { ListProps } from './list';
export type { ListItemProps } from './list-item';
declare const _default: import("react").FC<import("./list").ListProps> & {
    Item: import("react").FC<import("./list-item").ListItemProps>;
};
export default _default;
