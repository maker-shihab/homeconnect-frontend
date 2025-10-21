export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: Record<string, string[]>;
  timestamp?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ApiErrorResponse {
  error: {
    message: string;
    code?: string;
    statusCode: number;
    details?: ValidationError[];
    timestamp?: string;
  };
}

export type AppError = ApiError | Error | unknown;