/// <reference types="react" />
declare function useLatest<T>(value: T): import("react").MutableRefObject<T>;
export default useLatest;
