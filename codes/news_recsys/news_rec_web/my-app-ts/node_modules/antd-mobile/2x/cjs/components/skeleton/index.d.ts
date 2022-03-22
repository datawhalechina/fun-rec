/// <reference types="react" />
import './skeleton.less';
export type { SkeletonProps, SkeletonTitleProps } from './skeleton';
declare const _default: import("react").FC<import("./skeleton").SkeletonProps> & {
    Title: import("react").FC<import("./skeleton").SkeletonTitleProps>;
    Paragraph: import("react").FC<import("./skeleton").SkeletonParagraphProps>;
};
export default _default;
