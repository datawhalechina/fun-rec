import { FC, ReactNode } from 'react';
declare type SidebarProps = {
    indexItems: {
        index: string;
        brief: ReactNode;
    }[];
    activeIndex: string | null;
    onActive: (index: string) => void;
};
export declare const Sidebar: FC<SidebarProps>;
export {};
