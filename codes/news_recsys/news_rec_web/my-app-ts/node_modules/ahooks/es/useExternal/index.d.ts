export interface Options {
    type?: 'js' | 'css';
    js?: Partial<HTMLScriptElement>;
    css?: Partial<HTMLStyleElement>;
}
export declare type Status = 'unset' | 'loading' | 'ready' | 'error';
declare const useExternal: (path?: string | undefined, options?: Options | undefined) => Status;
export default useExternal;
