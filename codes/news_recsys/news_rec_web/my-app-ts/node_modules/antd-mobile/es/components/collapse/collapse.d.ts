import React, { FC } from 'react';
import { NativeProps } from '../../utils/native-props';
export declare type CollapsePanelProps = {
    key: string;
    title: React.ReactNode;
    disabled?: boolean;
    forceRender?: boolean;
    destroyOnClose?: boolean;
    onClick?: (event: React.MouseEvent<Element, MouseEvent>) => void;
    arrow?: React.ReactNode | ((active: boolean) => React.ReactNode);
} & NativeProps;
export declare const CollapsePanel: FC<CollapsePanelProps>;
declare type ValueProps<T> = {
    activeKey?: T;
    defaultActiveKey?: T;
    onChange?: (activeKey: T) => void;
    arrow?: React.ReactNode | ((active: boolean) => React.ReactNode);
};
export declare type CollapseProps = (({
    accordion?: false;
} & ValueProps<string[]>) | ({
    accordion: true;
} & ValueProps<string | null>)) & NativeProps;
export declare const Collapse: FC<CollapseProps>;
export {};
