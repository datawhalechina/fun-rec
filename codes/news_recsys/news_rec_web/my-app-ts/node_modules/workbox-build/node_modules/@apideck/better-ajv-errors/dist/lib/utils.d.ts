export declare const pointerToDotNotation: (pointer: string) => string;
export declare const cleanAjvMessage: (message: string) => string;
export declare const getLastSegment: (path: string) => string;
export declare const safeJsonPointer: <T>({ object, pnter, fallback }: {
    object: any;
    pnter: string;
    fallback: T;
}) => T;
