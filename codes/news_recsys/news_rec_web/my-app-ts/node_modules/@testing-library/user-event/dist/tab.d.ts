interface tabOptions {
    shift?: boolean;
    focusTrap?: Document | Element;
}
declare function tab({ shift, focusTrap }?: tabOptions): void;
export { tab };
