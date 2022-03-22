import { NativeProps } from '../../utils/native-props';
import React from 'react';
import { GetContainer } from '../../utils/render-to-container';
import { PropagationEvent } from '../../utils/with-stop-propagation';
export declare type MaskProps = {
    visible?: boolean;
    onMaskClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    destroyOnClose?: boolean;
    forceRender?: boolean;
    disableBodyScroll?: boolean;
    color?: 'black' | 'white';
    opacity?: 'default' | 'thin' | 'thick' | number;
    getContainer?: GetContainer;
    afterShow?: () => void;
    afterClose?: () => void;
    stopPropagation?: PropagationEvent[];
} & NativeProps<'--z-index'>;
export declare const Mask: React.FC<MaskProps>;
