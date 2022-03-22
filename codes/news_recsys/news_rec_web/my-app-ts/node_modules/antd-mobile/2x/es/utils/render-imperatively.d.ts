import { ReactElement } from 'react';
declare type ImperativeProps = {
    visible?: boolean;
    onClose?: () => void;
    afterClose?: () => void;
};
export declare function renderImperatively(element: ReactElement<ImperativeProps>): {
    close: () => void;
};
export {};
