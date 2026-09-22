/** Mirrors the backend's error envelope (src/middleware/errorHandler.ts): { error: { code, message, field? } }. */
export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR'
  | (string & {});

export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: ApiErrorCode;
  readonly field?: string;
  readonly retryAfterSeconds?: number;

  constructor(statusCode: number, code: ApiErrorCode, message: string, field?: string, retryAfterSeconds?: number) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.field = field;
    this.retryAfterSeconds = retryAfterSeconds;
  }

  get isConflict() {
    return this.statusCode === 409;
  }
}

/** Thrown when the server is unreachable or the response isn't valid JSON — distinct from a real ApiError. */
export class NetworkError extends Error {}
