export interface RAGQuery {
    query: string;
}

export interface RAGResponse {
    answer: any;
    provider?: string;
    confidence?: number;
    sources?: any[];
}