import type { Controller } from './Controller';
export declare class EventStore {
    private _listeners;
    private _ctrl;
    constructor(ctrl: Controller);
    add(element: EventTarget, device: string, action: string, handler: (event: any) => void, options?: AddEventListenerOptions): void;
    clean(): void;
}
