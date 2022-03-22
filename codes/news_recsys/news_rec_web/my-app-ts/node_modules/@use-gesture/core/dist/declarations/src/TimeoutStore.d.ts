export declare class TimeoutStore {
    private _timeouts;
    add<FunctionType extends (...args: any[]) => any>(key: string, callback: FunctionType, ms?: number, ...args: Parameters<FunctionType>): void;
    remove(key: string): void;
    clean(): void;
}
