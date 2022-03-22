export declare type DateRange = [Date, Date] | null;
export declare function convertValueToRange(selectionMode: 'single' | 'range' | undefined, value: Date | [Date, Date] | null): DateRange;
