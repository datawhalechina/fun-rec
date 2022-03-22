import { ErrorObject } from 'ajv';
import type { JSONSchema6 } from 'json-schema';
import { ValidationError } from './types/ValidationError';
export interface BetterAjvErrorsOptions {
    errors: ErrorObject[] | null | undefined;
    data: any;
    schema: JSONSchema6;
    basePath?: string;
}
export declare const betterAjvErrors: ({ errors, data, schema, basePath, }: BetterAjvErrorsOptions) => ValidationError[];
export { ValidationError };
