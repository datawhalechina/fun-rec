import React, { FC } from 'react';
import { NativeProps } from '../../utils/native-props';
export declare type GridProps = {
    columns: number;
    gap?: number | string | [number | string, number | string];
} & NativeProps<'--gap' | '--gap-vertical' | '--gap-horizontal'>;
export declare const Grid: FC<GridProps>;
export declare type GridItemProps = {
    span?: number;
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
} & NativeProps;
export declare const GridItem: FC<GridItemProps>;
