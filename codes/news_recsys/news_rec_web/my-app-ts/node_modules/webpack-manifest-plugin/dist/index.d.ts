import { Compiler, WebpackPluginInstance } from 'webpack';
import { FileDescriptor } from './helpers';
import { getCompilerHooks } from './hooks';
export declare type Manifest = Record<string, any>;
export interface InternalOptions {
    [key: string]: any;
    assetHookStage: number;
    basePath: string;
    fileName: string;
    filter: (file: FileDescriptor) => Boolean;
    generate: (seed: Record<any, any>, files: FileDescriptor[], entries: Record<string, string[]>) => Manifest;
    map: (file: FileDescriptor) => FileDescriptor;
    publicPath: string;
    removeKeyHash: RegExp | false;
    seed: Record<any, any>;
    serialize: (manifest: Manifest) => string;
    sort: (fileA: FileDescriptor, fileB: FileDescriptor) => Number;
    transformExtensions: RegExp;
    useEntryKeys: Boolean;
    useLegacyEmit: Boolean;
    writeToFileEmit: Boolean;
}
export declare type ManifestPluginOptions = Partial<InternalOptions>;
export declare type EmitCountMap = Map<any, any>;
declare class WebpackManifestPlugin implements WebpackPluginInstance {
    private options;
    constructor(opts: ManifestPluginOptions);
    apply(compiler: Compiler): void;
}
export { getCompilerHooks, WebpackManifestPlugin };
