import { Metric, ReportHandler } from '../types.js';
export declare const bindReporter: (callback: ReportHandler, metric: Metric, reportAllChanges?: boolean | undefined) => (forceReport?: boolean | undefined) => void;
