import React, { FC } from 'react';
import { NativeProps } from '../../utils/native-props';
export declare type DropdownItemProps = {
    key: string;
    title: React.ReactNode;
    active?: boolean;
    highlight?: boolean;
    forceRender?: boolean;
    destroyOnClose?: boolean;
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    arrow?: React.ReactNode;
} & NativeProps;
declare const Item: FC<DropdownItemProps>;
export default Item;
declare type DropdownItemChildrenWrapProps = {
    onClick?: () => void;
} & Pick<DropdownItemProps, 'active' | 'forceRender' | 'destroyOnClose'>;
export declare const ItemChildrenWrap: FC<DropdownItemChildrenWrapProps>;
