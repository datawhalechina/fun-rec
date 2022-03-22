import React from 'react';
import { NativeProps } from '../../utils/native-props';
export declare type NoticeBarProps = {
    /** 通告栏的类型 */
    color?: 'default' | 'alert' | 'error' | 'info';
    /** 开始滚动的延迟，单位 ms */
    delay?: number;
    /** 滚动速度，单位 px/s */
    speed?: number;
    /** 公告内容 */
    content: React.ReactNode;
    /** 是否可关闭 */
    closeable?: boolean;
    /** 关闭时的回调 */
    onClose?: () => void;
    /** 额外操作区域，显示在关闭按钮左侧 */
    extra?: React.ReactNode;
    /** 左侧广播图标 */
    icon?: React.ReactNode;
} & NativeProps<'--background-color' | '--border-color' | '--text-color' | '--font-size' | '--icon-font-size' | '--height'>;
export declare const NoticeBar: React.NamedExoticComponent<NoticeBarProps>;
