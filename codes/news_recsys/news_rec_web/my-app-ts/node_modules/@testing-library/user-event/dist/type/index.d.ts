import { typeOptions } from './typeImplementation';
export declare function type(element: Element, text: string, options?: typeOptions & {
    delay?: 0;
}): void;
export declare function type(element: Element, text: string, options: typeOptions & {
    delay: number;
}): Promise<void>;
