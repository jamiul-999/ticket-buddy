import { apiClient } from "./client";
import { RAGQuery, RAGResponse } from '../types/rag';

export const ragApi = {
    query: (query: string): Promise<RAGResponse> =>
        apiClient.post<RAGResponse>('/query', { query }),
};