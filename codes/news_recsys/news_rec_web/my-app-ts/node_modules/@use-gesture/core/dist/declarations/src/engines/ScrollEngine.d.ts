import { CoordinatesEngine } from './CoordinatesEngine';
export declare class ScrollEngine extends CoordinatesEngine<'scroll'> {
    ingKey: "scrolling";
    scroll(event: UIEvent): void;
    scrollChange(event: UIEvent): void;
    scrollEnd(): void;
    bind(bindFunction: any): void;
}
