import type { PluginCreator } from 'postcss';
declare const creator: PluginCreator<{
    preserve?: boolean;
    onComplexSelector?: 'warning';
    specificityMatchingName?: string;
}>;
export default creator;
