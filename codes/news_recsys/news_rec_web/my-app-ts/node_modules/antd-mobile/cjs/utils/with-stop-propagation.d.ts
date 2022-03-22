import React, { ReactElement } from 'react';
export declare type PropagationEvent = 'click';
export declare function withStopPropagation(events: PropagationEvent[], element: ReactElement): React.ReactElement<any, string | React.JSXElementConstructor<any>>;
