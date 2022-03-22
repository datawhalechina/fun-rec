export declare type TDate = Date | number | string | undefined;
export declare type Options = {
    targetDate?: TDate;
    interval?: number;
    onEnd?: () => void;
};
export interface FormattedRes {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
}
declare const useCountdown: (options?: Options | undefined) => readonly [number, FormattedRes];
export default useCountdown;
