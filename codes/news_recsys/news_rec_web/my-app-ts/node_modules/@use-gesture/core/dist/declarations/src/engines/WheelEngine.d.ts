import { CoordinatesEngine } from './CoordinatesEngine';
export interface WheelEngine extends CoordinatesEngine<'wheel'> {
    wheel(this: WheelEngine, event: WheelEvent): void;
    wheelChange(this: WheelEngine, event: WheelEvent): void;
    wheelEnd(this: WheelEngine): void;
}
export declare class WheelEngine extends CoordinatesEngine<'wheel'> {
    ingKey: "wheeling";
    bind(bindFunction: any): void;
}
