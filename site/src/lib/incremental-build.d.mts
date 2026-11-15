/** Stable fingerprint for the data and shared inputs used to render a page. */
export function buildCacheKey(...inputs: unknown[]): string;
/** SHA-256 fingerprint of named repository-relative files and directories. */
export function fingerprintPaths(root: string, relativePaths: readonly string[]): Promise<string>;
