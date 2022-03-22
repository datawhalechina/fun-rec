import Cookies from 'js-cookie';
export declare type State = string | undefined;
export interface Options extends Cookies.CookieAttributes {
    defaultValue?: State | (() => State);
}
declare function useCookieState(cookieKey: string, options?: Options): readonly [string | undefined, (this: unknown, newValue: string | ((prevState: State) => State) | undefined, newOptions?: Cookies.CookieAttributes | undefined) => void];
export default useCookieState;
