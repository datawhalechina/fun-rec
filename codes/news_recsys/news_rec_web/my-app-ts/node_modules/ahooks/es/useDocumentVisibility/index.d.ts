declare type VisibilityState = 'hidden' | 'visible' | 'prerender' | undefined;
declare function useDocumentVisibility(): VisibilityState;
export default useDocumentVisibility;
