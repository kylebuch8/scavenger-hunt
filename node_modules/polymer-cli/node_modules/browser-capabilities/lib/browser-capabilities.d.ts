/**
 * A feature supported by a web browser.
 */
export declare type BrowserCapability = 'es2015' | 'push' | 'serviceworker' | 'modules';
export declare type UserAgentPredicate = (ua: any) => boolean;
/**
 * Return the set of capabilities for a user agent string.
 */
export declare function browserCapabilities(userAgent: string): Set<BrowserCapability>;
/**
 * Parse a "x.y.z" version string of any length into integer parts. Returns -1
 * for a part that doesn't parse.
 */
export declare function parseVersion(version: string): number[];
/**
 * Return whether `version` is at least as high as `atLeast`.
 */
export declare function versionAtLeast(atLeast: number[], version: number[]): boolean;
