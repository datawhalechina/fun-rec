import type { useEffect, useLayoutEffect } from 'react';
declare type effectHookType = typeof useEffect | typeof useLayoutEffect;
export declare const createUpdateEffect: (hook: effectHookType) => effectHookType;
export {};
