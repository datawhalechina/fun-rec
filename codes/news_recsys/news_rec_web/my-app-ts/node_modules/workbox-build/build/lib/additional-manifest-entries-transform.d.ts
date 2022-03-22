import { ManifestEntry } from '../types';
declare type AdditionalManifestEntriesTransform = {
    (manifest: Array<ManifestEntry & {
        size: number;
    }>): {
        manifest: Array<ManifestEntry & {
            size: number;
        }>;
        warnings: string[];
    };
};
export declare function additionalManifestEntriesTransform(additionalManifestEntries: Array<ManifestEntry | string>): AdditionalManifestEntriesTransform;
export {};
