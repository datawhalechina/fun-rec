/// <reference types="react" />
import './index-bar.less';
export type { IndexBarProps, IndexBarRef } from './index-bar';
export type { IndexBarPanelProps } from './panel';
declare const _default: import("react").ForwardRefExoticComponent<{
    sticky?: boolean | undefined;
    children?: import("react").ReactNode;
} & import("../../utils/native-props").NativeProps<"--sticky-offset-top"> & import("react").RefAttributes<import("./index-bar").IndexBarRef>> & {
    Panel: import("react").FC<import("./panel").IndexBarPanelProps>;
};
export default _default;
