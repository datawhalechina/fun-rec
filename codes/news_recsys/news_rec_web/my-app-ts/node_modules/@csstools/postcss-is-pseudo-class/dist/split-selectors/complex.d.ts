export default function complexSelectors(selectors: string[], pluginOptions: {
    onComplexSelector?: 'warning';
}, warnFn: () => void): string[];
