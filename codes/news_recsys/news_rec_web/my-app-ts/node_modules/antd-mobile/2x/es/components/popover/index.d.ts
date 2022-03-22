/// <reference types="react" />
import './popover.less';
import './popover-menu.less';
export type { PopoverProps, PopoverRef } from './popover';
export type { PopoverMenuProps, Action } from './popover-menu';
export declare type Placement = 'top' | 'top-start' | 'top-end' | 'right' | 'right-start' | 'right-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end';
export declare type DeprecatedPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';
declare const _default: import("react").ForwardRefExoticComponent<{
    defaultVisible?: boolean | undefined;
    visible?: boolean | undefined;
    onVisibleChange?: ((visible: boolean) => void) | undefined;
    getContainer?: import("../../utils/render-to-container").GetContainer | undefined;
    destroyOnHide?: boolean | undefined;
    children: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
    mode?: "dark" | "light" | undefined;
    trigger?: "click" | undefined;
    placement?: DeprecatedPlacement | Placement | undefined;
    stopPropagation?: "click"[] | undefined;
    content: import("react").ReactNode;
} & import("../../utils/native-props").NativeProps<"--z-index"> & import("react").RefAttributes<import("./popover").PopoverRef>> & {
    Menu: import("react").ForwardRefExoticComponent<Omit<import("./popover").PopoverProps, "content"> & {
        actions: import("./popover-menu").Action[];
        onAction?: ((item: import("./popover-menu").Action) => void) | undefined;
    } & import("react").RefAttributes<import("./popover").PopoverRef>>;
};
export default _default;
