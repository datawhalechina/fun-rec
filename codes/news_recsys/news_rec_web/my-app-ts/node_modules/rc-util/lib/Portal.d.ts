import * as React from 'react';
export declare type PortalRef = {};
export interface PortalProps {
    didUpdate?: (prevProps: PortalProps) => void;
    getContainer: () => HTMLElement;
    children?: React.ReactNode;
}
declare const Portal: React.ForwardRefExoticComponent<PortalProps & React.RefAttributes<PortalRef>>;
export default Portal;
