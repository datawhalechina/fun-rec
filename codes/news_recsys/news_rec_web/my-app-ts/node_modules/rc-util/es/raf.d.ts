declare function wrapperRaf(callback: () => void, times?: number): number;
declare namespace wrapperRaf {
    var cancel: (id: number) => void;
}
export default wrapperRaf;
