import webpack, { AssetInfo, Chunk } from 'webpack';
import { InternalOptions, Manifest } from './';
export interface FileDescriptor {
    chunk?: ProperChunk;
    isAsset: Boolean;
    isChunk: Boolean;
    isInitial: Boolean;
    isModuleAsset: Boolean;
    name: string;
    path: string;
}
export interface CompilationAssetInfo extends AssetInfo {
    sourceFilename: string;
}
export interface CompilationAsset extends webpack.compilation.Asset {
    chunks: any[];
    info: CompilationAssetInfo;
}
export interface ProperChunk extends Chunk {
    auxiliaryFiles: any[];
}
declare const generateManifest: (compilation: webpack.compilation.Compilation, files: FileDescriptor[], { generate, seed }: InternalOptions) => Manifest;
declare const reduceAssets: (files: FileDescriptor[], asset: CompilationAsset, moduleAssets: Record<any, any>) => FileDescriptor[];
declare const reduceChunk: (files: FileDescriptor[], chunk: ProperChunk, options: InternalOptions, auxiliaryFiles: Record<any, any>) => FileDescriptor[];
declare const transformFiles: (files: FileDescriptor[], options: InternalOptions) => FileDescriptor[];
export { generateManifest, reduceAssets, reduceChunk, transformFiles };
