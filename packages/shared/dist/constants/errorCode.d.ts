export declare const ErrorCode: {
    readonly UNAUTHORIZED: "AUTH_001";
    readonly FORBIDDEN: "AUTH_002";
    readonly TOKEN_EXPIRED: "AUTH_003";
    readonly VALIDATION_FAILED: "VAL_001";
    readonly INVALID_INPUT: "VAL_002";
    readonly NOT_FOUND: "RES_001";
    readonly ALREADY_EXISTS: "RES_002";
    readonly INTERNAL_ERROR: "SRV_001";
    readonly DATABASE_ERROR: "SRV_002";
};
export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
