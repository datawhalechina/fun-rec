import { Vector2 } from '../types';
export declare function clamp(v: number, min: number, max: number): number;
export declare const V: {
    toVector<T>(v: T | [T, T] | undefined, fallback?: T | [T, T] | undefined): [T, T];
    add(v1: Vector2, v2: Vector2): Vector2;
    sub(v1: Vector2, v2: Vector2): Vector2;
    addTo(v1: Vector2, v2: Vector2): void;
    subTo(v1: Vector2, v2: Vector2): void;
};
export declare function rubberbandIfOutOfBounds(position: number, min: number, max: number, constant?: number): number;
export declare function computeRubberband(bounds: [Vector2, Vector2], [Vx, Vy]: Vector2, [Rx, Ry]: Vector2): Vector2;
