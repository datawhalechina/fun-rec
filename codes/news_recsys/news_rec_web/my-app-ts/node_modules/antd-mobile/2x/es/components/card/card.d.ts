import React, { FC, ReactNode } from 'react';
import { NativeProps } from '../../utils/native-props';
export declare type CardProps = {
    title?: ReactNode;
    extra?: ReactNode;
    headerStyle?: React.CSSProperties;
    headerClassName?: string;
    bodyStyle?: React.CSSProperties;
    bodyClassName?: string;
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onBodyClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onHeaderClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
} & NativeProps;
export declare const Card: FC<CardProps>;
