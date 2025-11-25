export interface ApiError {
    error: string;
    message: string;
    details?: Record<string, any>;
}

export interface ApiResponse<T> {
    data: T,
    error?: ApiError
}
