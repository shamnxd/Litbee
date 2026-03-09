import type { AxiosError } from 'axios';

export interface ApiErrorResponse {
    message?: string;
    statusCode?: number;
    error?: string;
}

export type ApiError = AxiosError<ApiErrorResponse>;

export type AppError = Error | ApiError | unknown;

export const isAxiosError = (error: unknown): error is AxiosError => {
    return error instanceof Error && 'response' in error;
};

export const getErrorMessage = (error: AppError): string => {
    if (isAxiosError(error)) {
        const message = (error.response?.data as ApiErrorResponse)?.message;
        return message || error.message || 'An error occurred';
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'An unknown error occurred';
};
