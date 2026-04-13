/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Health status for a single directory.
 */
export type DirectoryCheck = {
    path: string;
    exists: boolean;
    writable: boolean;
    error?: (string | null);
};

