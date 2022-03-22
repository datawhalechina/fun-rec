import { FC } from 'react';
import { TaskStatus } from './image-uploader';
declare type Props = {
    onClick?: () => void;
    onDelete?: () => void;
    deletable: boolean;
    url?: string;
    file?: File;
    status?: TaskStatus;
};
declare const PreviewItem: FC<Props>;
export default PreviewItem;
