// Environment variables in Next.js are automatically replaced at build time
// NEXT_PUBLIC_ variables are available on both client and server
declare const process: { env?: { NEXT_PUBLIC_API_URL?: string } } | undefined;
const API_BASE_URL = (process?.env?.NEXT_PUBLIC_API_URL) || 'http://localhost:8000';

interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    // In Next.js, process.env.NEXT_PUBLIC_* variables are replaced at build time
    // So we can safely use them
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `HTTP error! status: ${response.status}` };
        }
        
        const error: ApiError = {
          message: errorData.message || `Request failed with status ${response.status}`,
          status: response.status,
          details: errorData.details || errorData,
        };
        
        throw error;
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      // For non-JSON responses
      return {} as T;
      
    } catch (error) {
      console.error('API request failed:', error);
      if (error instanceof Error) {
        throw { message: error.message };
      }
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = new ApiClient();