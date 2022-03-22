import { FC } from 'react';
import { ListItemProps } from '../list';
import { NativeProps } from '../../utils/native-props';
export declare type CheckListItemProps = Pick<ListItemProps, 'title' | 'children' | 'description' | 'prefix' | 'disabled' | 'onClick' | 'style'> & {
    value: string;
    readOnly?: boolean;
} & NativeProps;
export declare const CheckListItem: FC<CheckListItemProps>;
