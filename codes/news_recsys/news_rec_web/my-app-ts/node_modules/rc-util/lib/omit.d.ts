export default function omit<T extends object, K extends keyof T>(obj: T, fields: K[]): Omit<T, K>;
