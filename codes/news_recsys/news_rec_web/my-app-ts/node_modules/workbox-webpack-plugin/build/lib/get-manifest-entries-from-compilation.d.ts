import { Compilation } from 'webpack';
import { WebpackGenerateSWOptions, WebpackInjectManifestOptions, ManifestEntry } from 'workbox-build';
export declare function getManifestEntriesFromCompilation(compilation: Compilation, config: WebpackGenerateSWOptions | WebpackInjectManifestOptions): Promise<{
    size: number;
    sortedEntries: ManifestEntry[];
}>;
