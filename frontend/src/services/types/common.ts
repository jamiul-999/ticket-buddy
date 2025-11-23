export interface ApiResponse<T> {
    data: T,
    message?: string;
    error?: string;
}

export interface District {
    id: number;
    name: string;
    dropping_points: string[];
}